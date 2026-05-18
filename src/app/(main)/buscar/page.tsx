'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import type { TransactionType, PropertyType } from '@/domains/listing/types';

export default function BuscarPage() {
  return (
    <Suspense>
      <BuscarContent />
    </Suspense>
  );
}

function BuscarContent() {
  const searchParams = useSearchParams();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_SEARCH_RADIUS_KM);
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [radiusUsed, setRadiusUsed] = useState(DEFAULT_SEARCH_RADIUS_KM);
  const [loading, setLoading] = useState(false);
  const transactionParam = searchParams.get('transaction') as TransactionType | null;
  const typeParam = searchParams.get('type');
  const [filters, setFilters] = useState<Filters>(() => ({
    ...(transactionParam && (transactionParam === 'venda' || transactionParam === 'aluguel') ? { transaction_type: transactionParam } : {}),
    ...(typeParam ? { property_type: typeParam as PropertyType } : {}),
  }));
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

  const [mobileResultsOpen, setMobileResultsOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-border/50 space-y-3 bg-background/95 backdrop-blur-sm">
        <SearchBar onSearch={handleSearch} onAddressSearch={handleAddressSearch} />
        <ListingFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
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

        {/* Desktop: Results sidebar */}
        <div className="hidden md:block w-96 border-l border-border/50 overflow-y-auto bg-background">
          {loading ? (
            <div className="p-6 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[4/3] rounded-xl bg-muted/70 animate-pulse-soft" style={{ animationDelay: `${i * 0.15}s` }} />
                  <div className="space-y-2 px-1">
                    <div className="h-5 bg-muted/70 rounded-md w-3/4" />
                    <div className="h-4 bg-muted/50 rounded-md w-1/2" />
                    <div className="flex gap-3 pt-1">
                      <div className="h-4 bg-muted/50 rounded-md w-16" />
                      <div className="h-4 bg-muted/50 rounded-md w-16" />
                      <div className="h-4 bg-muted/50 rounded-md w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState expanded={expanded} radiusKm={radiusUsed} />
          ) : (
            <div className="p-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground px-1 animate-fade-in">
                {results.length} {results.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
              </p>
              {results.map((r, index) => (
                <div
                  key={r.id}
                  onMouseEnter={() => setActiveMarker(r.id)}
                  onMouseLeave={() => setActiveMarker(null)}
                  className={`rounded-xl transition-all duration-200 animate-fade-in-up ${r.id === activeMarker ? 'ring-2 ring-primary/30 scale-[1.01]' : 'hover:ring-1 hover:ring-border'}`}
                  style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
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

        {/* Mobile: Bottom sheet toggle */}
        {results.length > 0 && (
          <button
            onClick={() => setMobileResultsOpen(!mobileResultsOpen)}
            className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200 animate-slide-up"
          >
            {mobileResultsOpen ? 'Ver mapa' : `Ver ${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
          </button>
        )}

        {/* Mobile: Bottom sheet results */}
        {mobileResultsOpen && (
          <div className="md:hidden absolute inset-0 z-10 bg-background overflow-y-auto animate-slide-up">
            <div className="p-4 space-y-4 pb-24">
              <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm py-3 -mt-4 -mx-4 px-4 border-b border-border/50 z-10">
                <p className="text-sm font-semibold text-foreground">
                  {results.length} {results.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                </p>
                <button
                  onClick={() => setMobileResultsOpen(false)}
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 active:scale-95"
                >
                  Ver mapa
                </button>
              </div>
              {loading ? (
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="aspect-[4/3] rounded-xl bg-muted/70 animate-pulse-soft" style={{ animationDelay: `${i * 0.15}s` }} />
                      <div className="space-y-2 px-1">
                        <div className="h-5 bg-muted/70 rounded-md w-3/4" />
                        <div className="h-4 bg-muted/50 rounded-md w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                results.map(r => (
                  <ListingCard
                    key={r.id}
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
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
