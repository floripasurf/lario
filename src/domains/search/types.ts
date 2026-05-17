export interface GeoSearchParams {
  lat: number;
  lng: number;
  radius_km: number;
  transaction_type?: 'venda' | 'aluguel';
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
  limit?: number;
  offset?: number;
}

export interface GeoSearchResult {
  id: string;
  slug: string;
  title: string;
  transaction_type: string;
  property_type: string;
  price_cents: number;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  photos: string[];
  lat_approx: number;
  lng_approx: number;
  distance_m: number;
}

export interface GeoSearchResponse {
  results: GeoSearchResult[];
  total: number;
  expanded: boolean;
  radius_used_km: number;
}
