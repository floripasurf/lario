import { z } from 'zod';

export const declareTransactionSchema = z.object({
  listing_id: z.string().uuid(),
  declared_price_cents: z.number().int().positive(),
});
