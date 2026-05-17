'use client';

import { useState, useCallback, useEffect } from 'react';
import { MapContainer } from '@/components/map/map-container';
import { SearchBar } from '@/components/search/search-bar';
import { SearchControls } from '@/components/map/search-controls';
import { ListingCard } from '@/components/listing/listing-card';
import { ListingFilters } from '@/components/listing/listing-filters';
import { EmptyState } from '@/components/search/empty-state';
import { DEFAULT_SEARCH_RADIUS_KM } from '@/lib/constants';
import { useDebounce } from '@/hooks/use-debounce';
import { formatBRL } from '@/lib/fees/calculator';
import type { GeoSearchResult, GeoSearchResponse } from '@/domains/search/types';
import type { ListingFilters as Filters } from '@/domains/listing/types';

export default function BuscarPage() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_SEARCH_RADIUS_KM);
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [radiusUsed, setRadiusUsed] = useState(DEFAULT_SEARCH_RADIUS_KM);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY || ''}`;
  const debouncedRadius = useDebounce(radiusKm, 300);

  const fetchResults = useCallback(async (lat: number, lng: number, radius: number, f: Filters) => {
    setLoading(true);
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });
    if (f.transaction_type) params.set('transaction_type', f.transaction_type);
    if (f.property_type) params.set('property_type', f.property_type);
    if (f.min_price) params.set('min_price', f.min_price.toString());
    if (f.max_price) params.set('max_price', f.max_price.toString());
    if (f.bedrooms) params.set('bedrooms', f.bedrooms.toString());

    try {
      const res = await fetch(`/api/search/geo?${params}`);
      const json: { data: GeoSearchResponse } = await res.json();
      setResults(json.data.results);
      setExpanded(json.data.expanded);
      setRadiusUsed(json.data.radius_used_km);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (center) fetchResults(center.lat, center.lng, debouncedRadius, filters);
  }, [center, debouncedRadius, filters, fetchResults]);

  const handleSearch = (lat: number, lng: number) => {
    setCenter({ lat, lng });
  };

  const handleAddressSearch = async (query: string) => {
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.data) setCenter({ lat: json.data.lat, lng: json.data.lng });
    } catch {}
  };

  const markers = results.map(r => ({
    id: r.id,
    lat: r.lat_approx,
    lng: r.lng_approx,
    price: formatBRL(r.price_cents),
    active: r.id === activeMarker,
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b space-y-3">
        <SearchBar onSearch={handleSearch} onAddressSearch={handleAddressSearch} />
        <ListingFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            styleUrl={styleUrl}
            center={center ? [center.lng, center.lat] : undefined}
            markers={markers}
            radiusCenter={center}
            radiusKm={radiusKm}
            onMapClick={(lat, lng) => setCenter({ lat, lng })}
            onMarkerClick={setActiveMarker}
            className="w-full h-full"
          />
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72">
            <SearchControls
              radiusKm={radiusKm}
              onRadiusChange={setRadiusKm}
              resultCount={results.length}
              expanded={expanded}
            />
          </div>
        </div>

        {/* Results sidebar */}
        <div className="hidden md:block w-96 border-l overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Buscando...</div>
          ) : results.length === 0 ? (
            <EmptyState expanded={expanded} radiusKm={radiusUsed} />
          ) : (
            <div className="p-4 space-y-4">
              {results.map(r => (
                <div
                  key={r.id}
                  onMouseEnter={() => setActiveMarker(r.id)}
                  onMouseLeave={() => setActiveMarker(null)}
                >
                  <ListingCard
                    slug={r.slug}
                    title={r.title}
                    transaction_type={r.transaction_type}
                    property_type={r.property_type}
                    price_cents={r.price_cents}
                    area_m2={r.area_m2}
                    bedrooms={r.bedrooms}
                    bathrooms={r.bathrooms}
                    parking_spots={r.parking_spots}
                    address_neighborhood={r.address_neighborhood}
                    address_city={r.address_city}
                    photos={r.photos}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
