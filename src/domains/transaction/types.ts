export type TransactionStatus = 'declared' | 'confirmed' | 'invoiced' | 'paid';

export interface Transaction {
  id: string;
  listing_id: string;
  seller_id: string;
  declared_price_cents: number;
  fee_amount_cents: number;
  status: TransactionStatus;
  declared_at: string;
  confirmed_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeclareTransactionInput {
  listing_id: string;
  declared_price_cents: number;
}
