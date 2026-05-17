-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Custom types
CREATE TYPE user_type AS ENUM ('pf', 'corretor');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'paused', 'sold', 'rented', 'expired');
CREATE TYPE transaction_type AS ENUM ('venda', 'aluguel');
CREATE TYPE property_type AS ENUM (
  'apartamento', 'casa', 'cobertura', 'terreno', 'sala_comercial',
  'loja', 'galpao', 'sitio', 'chacara', 'fazenda'
);
CREATE TYPE transaction_status AS ENUM ('declared', 'confirmed', 'invoiced', 'paid');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL DEFAULT 'pf',
  full_name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  creci_number TEXT,
  creci_state CHAR(2),
  creci_verified BOOLEAN DEFAULT FALSE,
  reputation_score NUMERIC(3,2) DEFAULT 0.00,
  reputation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  status listing_status NOT NULL DEFAULT 'draft',
  transaction_type transaction_type NOT NULL,
  property_type property_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents BIGINT NOT NULL CHECK (price_cents > 0),
  condo_fee_cents BIGINT,
  iptu_cents BIGINT,
  area_m2 NUMERIC(10,2) NOT NULL CHECK (area_m2 > 0),
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  parking_spots INTEGER NOT NULL DEFAULT 0,
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_neighborhood TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state CHAR(2) NOT NULL,
  address_zip TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326),
  location_approximate GEOGRAPHY(Point, 4326),
  photos TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for geo queries
CREATE INDEX idx_listings_location ON listings USING GIST (location);
CREATE INDEX idx_listings_location_approx ON listings USING GIST (location_approximate);
CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_listings_owner ON listings (owner_id);
CREATE INDEX idx_listings_slug ON listings (slug);
CREATE INDEX idx_listings_transaction_type ON listings (transaction_type);
CREATE INDEX idx_listings_property_type ON listings (property_type);
CREATE INDEX idx_listings_price ON listings (price_cents);
-- Trigram index for future duplicate detection
CREATE INDEX idx_listings_title_trgm ON listings USING GIN (title gin_trgm_ops);

-- Transactions table (success fee tracking)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  declared_price_cents BIGINT NOT NULL CHECK (declared_price_cents > 0),
  fee_amount_cents BIGINT NOT NULL CHECK (fee_amount_cents > 0),
  status transaction_status NOT NULL DEFAULT 'declared',
  declared_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_listing ON transactions (listing_id);
CREATE INDEX idx_transactions_seller ON transactions (seller_id);

-- Geocoding cache
CREATE TABLE geocoding_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_normalized TEXT UNIQUE NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  display_name TEXT,
  address_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);

CREATE INDEX idx_geocoding_cache_query ON geocoding_cache (query_normalized);
CREATE INDEX idx_geocoding_cache_expires ON geocoding_cache (expires_at);

-- Function: jitter_location (adds random offset for privacy)
CREATE OR REPLACE FUNCTION jitter_location(
  original GEOGRAPHY,
  max_offset_meters DOUBLE PRECISION DEFAULT 200
)
RETURNS GEOGRAPHY AS $$
DECLARE
  random_angle DOUBLE PRECISION;
  random_distance DOUBLE PRECISION;
  original_point GEOMETRY;
  jittered_point GEOMETRY;
BEGIN
  random_angle := random() * 2 * pi();
  random_distance := random() * max_offset_meters;
  original_point := original::geometry;

  jittered_point := ST_Project(
    original_point::geography,
    random_distance,
    random_angle
  )::geometry;

  RETURN jittered_point::geography;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Trigger: auto-generate location and location_approximate
CREATE OR REPLACE FUNCTION set_listing_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  NEW.location_approximate := jitter_location(NEW.location, 200);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_listings_set_location
  BEFORE INSERT OR UPDATE OF lat, lng ON listings
  FOR EACH ROW
  EXECUTE FUNCTION set_listing_location();

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile will be created by the app after registration form submission
  -- This is a placeholder for future auto-creation logic
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: search_listings_by_radius
CREATE OR REPLACE FUNCTION search_listings_by_radius(
  search_lat DOUBLE PRECISION,
  search_lng DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION,
  filter_transaction_type transaction_type DEFAULT NULL,
  filter_property_type property_type DEFAULT NULL,
  filter_min_price BIGINT DEFAULT NULL,
  filter_max_price BIGINT DEFAULT NULL,
  filter_bedrooms INTEGER DEFAULT NULL,
  filter_bathrooms INTEGER DEFAULT NULL,
  filter_parking INTEGER DEFAULT NULL,
  result_limit INTEGER DEFAULT 50,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  transaction_type transaction_type,
  property_type property_type,
  price_cents BIGINT,
  area_m2 NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spots INTEGER,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  photos TEXT[],
  lat_approx DOUBLE PRECISION,
  lng_approx DOUBLE PRECISION,
  distance_m DOUBLE PRECISION
) AS $$
DECLARE
  search_point GEOGRAPHY;
BEGIN
  search_point := ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography;

  RETURN QUERY
  SELECT
    l.id,
    l.slug,
    l.title,
    l.transaction_type,
    l.property_type,
    l.price_cents,
    l.area_m2,
    l.bedrooms,
    l.bathrooms,
    l.parking_spots,
    l.address_neighborhood,
    l.address_city,
    l.address_state,
    l.photos,
    ST_Y(l.location_approximate::geometry) AS lat_approx,
    ST_X(l.location_approximate::geometry) AS lng_approx,
    ST_Distance(l.location, search_point) AS distance_m
  FROM listings l
  WHERE l.status = 'active'
    AND ST_DWithin(l.location, search_point, radius_meters)
    AND (filter_transaction_type IS NULL OR l.transaction_type = filter_transaction_type)
    AND (filter_property_type IS NULL OR l.property_type = filter_property_type)
    AND (filter_min_price IS NULL OR l.price_cents >= filter_min_price)
    AND (filter_max_price IS NULL OR l.price_cents <= filter_max_price)
    AND (filter_bedrooms IS NULL OR l.bedrooms >= filter_bedrooms)
    AND (filter_bathrooms IS NULL OR l.bathrooms >= filter_bathrooms)
    AND (filter_parking IS NULL OR l.parking_spots >= filter_parking)
  ORDER BY distance_m ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE geocoding_cache ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings RLS
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT USING (status = 'active' OR owner_id = auth.uid());

CREATE POLICY "Users can create own listings"
  ON listings FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE USING (owner_id = auth.uid());

-- Transactions RLS
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT WITH CHECK (seller_id = auth.uid());

-- Geocoding cache: only service_role can access
CREATE POLICY "Service role can manage geocoding cache"
  ON geocoding_cache FOR ALL USING (auth.role() = 'service_role');

-- Storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view listing photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

CREATE POLICY "Authenticated users can upload listing photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listings' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own listing photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
