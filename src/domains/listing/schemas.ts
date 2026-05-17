import { z } from 'zod';
import { PROPERTY_TYPES, TRANSACTION_TYPES, LISTING_STATUSES, BRAZILIAN_STATES } from '@/lib/constants';

export const createListingSchema = z.object({
  transaction_type: z.enum(TRANSACTION_TYPES),
  property_type: z.enum(PROPERTY_TYPES),
  title: z.string().min(10).max(120),
  description: z.string().min(30).max(5000),
  price_cents: z.number().int().positive(),
  condo_fee_cents: z.number().int().nonnegative().optional(),
  iptu_cents: z.number().int().nonnegative().optional(),
  area_m2: z.number().positive(),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  parking_spots: z.number().int().min(0).max(20),
  address_street: z.string().min(3),
  address_number: z.string().min(1),
  address_complement: z.string().optional(),
  address_neighborhood: z.string().min(2),
  address_city: z.string().min(2),
  address_state: z.enum(BRAZILIAN_STATES),
  address_zip: z.string().regex(/^\d{5}-?\d{3}$/),
  lat: z.number().min(-33.75).max(5.27),
  lng: z.number().min(-73.99).max(-34.79),
  photos: z.array(z.string().url()).min(1).max(20),
  features: z.array(z.string()).max(30),
});

export const updateListingSchema = z.object({
  status: z.enum(LISTING_STATUSES).optional(),
  title: z.string().min(10).max(120).optional(),
  description: z.string().min(30).max(5000).optional(),
  price_cents: z.number().int().positive().optional(),
  condo_fee_cents: z.number().int().nonnegative().optional(),
  iptu_cents: z.number().int().nonnegative().optional(),
  area_m2: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  parking_spots: z.number().int().min(0).max(20).optional(),
  photos: z.array(z.string().url()).min(1).max(20).optional(),
  features: z.array(z.string()).max(30).optional(),
});

export const listingFiltersSchema = z.object({
  transaction_type: z.enum(TRANSACTION_TYPES).optional(),
  property_type: z.enum(PROPERTY_TYPES).optional(),
  min_price: z.number().nonnegative().optional(),
  max_price: z.number().positive().optional(),
  min_area: z.number().nonnegative().optional(),
  max_area: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  parking_spots: z.number().int().min(0).optional(),
});
