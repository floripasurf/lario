import type { SupabaseClient } from '@supabase/supabase-js';
import { ListingRepository } from './repository';
import type { CreateListingInput, UpdateListingInput, ListingFilters, Listing } from './types';

export class ListingService {
  private repo: ListingRepository;

  constructor(supabase: SupabaseClient) {
    this.repo = new ListingRepository(supabase);
  }

  async getBySlug(slug: string): Promise<Listing | null> {
    return this.repo.findBySlug(slug);
  }

  async getById(id: string): Promise<Listing | null> {
    return this.repo.findById(id);
  }

  async getByOwner(ownerId: string): Promise<Listing[]> {
    return this.repo.findByOwner(ownerId);
  }

  async create(ownerId: string, input: CreateListingInput): Promise<Listing> {
    return this.repo.create(ownerId, input);
  }

  async update(id: string, ownerId: string, input: UpdateListingInput): Promise<Listing> {
    return this.repo.update(id, ownerId, input);
  }

  async softDelete(id: string, ownerId: string): Promise<void> {
    return this.repo.delete(id, ownerId);
  }

  async list(filters: ListingFilters, limit?: number, offset?: number): Promise<Listing[]> {
    return this.repo.list(filters, limit, offset);
  }
}
