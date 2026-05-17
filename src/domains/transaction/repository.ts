import type { SupabaseClient } from '@supabase/supabase-js';
import type { Transaction, DeclareTransactionInput } from './types';
import { calculateSuccessFee } from '@/lib/fees/calculator';

export class TransactionRepository {
  constructor(private supabase: SupabaseClient) {}

  async findByListing(listingId: string): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('listing_id', listingId)
      .single();
    if (error) return null;
    return data as Transaction;
  }

  async findBySeller(sellerId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Transaction[];
  }

  async declare(sellerId: string, input: DeclareTransactionInput): Promise<Transaction> {
    const feeAmount = calculateSuccessFee(input.declared_price_cents);
    const { data, error } = await this.supabase
      .from('transactions')
      .insert({
        listing_id: input.listing_id,
        seller_id: sellerId,
        declared_price_cents: input.declared_price_cents,
        fee_amount_cents: feeAmount,
        status: 'declared',
        declared_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Transaction;
  }
}
