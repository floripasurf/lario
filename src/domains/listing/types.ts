export type PropertyType = 'apartamento' | 'casa' | 'cobertura' | 'terreno' | 'sala_comercial' | 'loja' | 'galpao' | 'sitio' | 'chacara' | 'fazenda';
export type TransactionType = 'venda' | 'aluguel';
export type ListingStatus = 'draft' | 'active' | 'paused' | 'sold' | 'rented' | 'expired';

export interface Listing {
  id: string;
  owner_id: string;
  slug: string;
  status: ListingStatus;
  transaction_type: TransactionType;
  property_type: PropertyType;
  title: string;
  description: string;
  price_cents: number;
  condo_fee_cents: number | null;
  iptu_cents: number | null;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  address_street: string;
  address_number: string;
  address_complement: string | null;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  lat: number;
  lng: number;
  photos: string[];
  features: string[];
  created_at: string;
  updated_at: string;
  // joined fields
  owner?: { full_name: string; phone: string; user_type: string; creci_number: string | null };
}

export interface CreateListingInput {
  transaction_type: TransactionType;
  property_type: PropertyType;
  title: string;
  description: string;
  price_cents: number;
  condo_fee_cents?: number;
  iptu_cents?: number;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  address_street: string;
  address_number: string;
  address_complement?: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  lat: number;
  lng: number;
  photos: string[];
  features: string[];
}

export interface UpdateListingInput {
  status?: ListingStatus;
  title?: string;
  description?: string;
  price_cents?: number;
  condo_fee_cents?: number;
  iptu_cents?: number;
  area_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
  photos?: string[];
  features?: string[];
}

export interface ListingFilters {
  transaction_type?: TransactionType;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
}
