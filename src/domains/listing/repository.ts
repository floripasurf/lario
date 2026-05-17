import type { SupabaseClient } from '@supabase/supabase-js';
import type { Listing, CreateListingInput, UpdateListingInput, ListingFilters } from './types';
import { generateSlug } from './slug';

export class ListingRepository {
  constructor(private supabase: SupabaseClient) {}

  async findBySlug(slug: string): Promise<Listing | null> {
    const { data, error } = await this.supabase
      .from('listings')
      .select('*, owner:profiles!owner_id(full_name, phone, user_type, creci_number)')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (error) return null;
    return data as unknown as Listing;
  }

  async findById(id: string): Promise<Listing | null> {
    const { data, error } = await this.supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Listing;
  }

  async findByOwner(ownerId: string): Promise<Listing[]> {
    const { data, error } = await this.supabase
      .from('listings')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Listing[];
  }

  async create(ownerId: string, input: CreateListingInput): Promise<Listing> {
    const slug = generateSlug(input.title, input.address_city, input.address_state);
    const { data, error } = await this.supabase
      .from('listings')
      .insert({
        owner_id: ownerId,
        slug,
        status: 'active',
        ...input,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Listing;
  }

  async update(id: string, ownerId: string, input: UpdateListingInput): Promise<Listing> {
    const { data, error } = await this.supabase
      .from('listings')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Listing;
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('listings')
      .update({ status: 'expired' })
      .eq('id', id)
      .eq('owner_id', ownerId);
    if (error) throw new Error(error.message);
  }

  async list(filters: ListingFilters, limit = 20, offset = 0): Promise<Listing[]> {
    let query = this.supabase
      .from('listings')
      .select('*')
      .eq('status', 'active');

    if (filters.transaction_type) query = query.eq('transaction_type', filters.transaction_type);
    if (filters.property_type) query = query.eq('property_type', filters.property_type);
    if (filters.min_price) query = query.gte('price_cents', filters.min_price);
    if (filters.max_price) query = query.lte('price_cents', filters.max_price);
    if (filters.min_area) query = query.gte('area_m2', filters.min_area);
    if (filters.max_area) query = query.lte('area_m2', filters.max_area);
    if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
    if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms);
    if (filters.parking_spots) query = query.gte('parking_spots', filters.parking_spots);

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return (data ?? []) as Listing[];
  }
}
