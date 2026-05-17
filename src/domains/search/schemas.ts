import { z } from 'zod';
import { MAX_SEARCH_RADIUS_KM } from '@/lib/constants';

export const geoSearchSchema = z.object({
  lat: z.coerce.number().min(-33.75).max(5.27),
  lng: z.coerce.number().min(-73.99).max(-34.79),
  radius_km: z.coerce.number().min(0.5).max(MAX_SEARCH_RADIUS_KM).default(2),
  transaction_type: z.enum(['venda', 'aluguel']).optional(),
  property_type: z.string().optional(),
  min_price: z.coerce.number().nonnegative().optional(),
  max_price: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  parking_spots: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
