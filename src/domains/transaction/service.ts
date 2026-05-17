import type { SupabaseClient } from '@supabase/supabase-js';
import { TransactionRepository } from './repository';
import type { DeclareTransactionInput, Transaction } from './types';

export class TransactionService {
  private repo: TransactionRepository;

  constructor(supabase: SupabaseClient) {
    this.repo = new TransactionRepository(supabase);
  }

  async declare(sellerId: string, input: DeclareTransactionInput): Promise<Transaction> {
    return this.repo.declare(sellerId, input);
  }

  async getByListing(listingId: string): Promise<Transaction | null> {
    return this.repo.findByListing(listingId);
  }

  async getBySeller(sellerId: string): Promise<Transaction[]> {
    return this.repo.findBySeller(sellerId);
  }
}
