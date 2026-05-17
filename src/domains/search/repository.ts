import type { SupabaseClient } from '@supabase/supabase-js';
import type { GeoSearchParams, GeoSearchResult } from './types';

export class SearchRepository {
  constructor(private supabase: SupabaseClient) {}

  async searchByRadius(params: GeoSearchParams): Promise<{ results: GeoSearchResult[]; total: number }> {
    const { data, error } = await this.supabase.rpc('search_listings_by_radius', {
      search_lat: params.lat,
      search_lng: params.lng,
      radius_meters: params.radius_km * 1000,
      filter_transaction_type: params.transaction_type || null,
      filter_property_type: params.property_type || null,
      filter_min_price: params.min_price || null,
      filter_max_price: params.max_price || null,
      filter_bedrooms: params.bedrooms || null,
      filter_bathrooms: params.bathrooms || null,
      filter_parking: params.parking_spots || null,
      result_limit: params.limit || 50,
      result_offset: params.offset || 0,
    });

    if (error) throw new Error(error.message);
    return {
      results: (data ?? []) as GeoSearchResult[],
      total: data?.length ?? 0,
    };
  }
}
