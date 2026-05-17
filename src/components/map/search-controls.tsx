'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MAX_SEARCH_RADIUS_KM } from '@/lib/constants';

interface SearchControlsProps {
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  resultCount: number;
  expanded?: boolean;
}

export function SearchControls({ radiusKm, onRadiusChange, resultCount, expanded }: SearchControlsProps) {
  return (
    <div className="space-y-3 p-4 bg-background border rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Raio de busca</Label>
        <span className="text-sm font-semibold text-primary">{radiusKm} km</span>
      </div>
      <Slider
        value={[radiusKm]}
        onValueChange={(v) => onRadiusChange(Array.isArray(v) ? v[0] : v)}
        min={0.5}
        max={MAX_SEARCH_RADIUS_KM}
        step={0.5}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0.5 km</span>
        <span>{MAX_SEARCH_RADIUS_KM} km</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        {expanded && ' (raio expandido automaticamente)'}
      </p>
    </div>
  );
}
