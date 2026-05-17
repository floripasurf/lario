'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useGeolocation } from '@/hooks/use-geolocation';

interface SearchBarProps {
  onSearch: (lat: number, lng: number) => void;
  onAddressSearch: (query: string) => void;
}

export function SearchBar({ onSearch, onAddressSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { requestLocation, loading: geoLoading } = useGeolocation();
  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onAddressSearch(query.trim());
  };

  const handleGeolocate = () => {
    requestLocation();
    navigator.geolocation.getCurrentPosition(
      (pos) => onSearch(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por endereço, bairro ou cidade..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button type="button" variant="outline" size="icon" onClick={handleGeolocate} disabled={geoLoading} title="Usar minha localização">
        {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
      </Button>
      <Button type="submit">Buscar</Button>
    </form>
  );
}
