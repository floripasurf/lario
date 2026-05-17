import type { SupabaseClient } from '@supabase/supabase-js';
import { SearchRepository } from './repository';
import type { GeoSearchParams, GeoSearchResponse } from './types';
import { AUTO_EXPAND_RADII_KM } from '@/lib/constants';

export class SearchService {
  private repo: SearchRepository;

  constructor(supabase: SupabaseClient) {
    this.repo = new SearchRepository(supabase);
  }

  async searchGeo(params: GeoSearchParams): Promise<GeoSearchResponse> {
    const { results, total } = await this.repo.searchByRadius(params);

    if (results.length > 0) {
      return { results, total, expanded: false, radius_used_km: params.radius_km };
    }

    // Auto-expand radius
    for (const expandedRadius of AUTO_EXPAND_RADII_KM) {
      if (expandedRadius <= params.radius_km) continue;
      const expanded = await this.repo.searchByRadius({ ...params, radius_km: expandedRadius });
      if (expanded.results.length > 0) {
        return { results: expanded.results, total: expanded.total, expanded: true, radius_used_km: expandedRadius };
      }
    }

    return { results: [], total: 0, expanded: true, radius_used_km: AUTO_EXPAND_RADII_KM[AUTO_EXPAND_RADII_KM.length - 1] };
  }
}
