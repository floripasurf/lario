'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PROPERTY_TYPES, TRANSACTION_TYPES } from '@/lib/constants';
import type { ListingFilters as Filters } from '@/domains/listing/types';

interface ListingFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', cobertura: 'Cobertura',
  terreno: 'Terreno', sala_comercial: 'Sala Comercial', loja: 'Loja',
  galpao: 'Galpão', sitio: 'Sítio', chacara: 'Chácara', fazenda: 'Fazenda',
};

export function ListingFilters({ filters, onChange }: ListingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="space-y-1">
        <Label className="text-xs">Tipo</Label>
        <Select
          value={filters.transaction_type || 'all'}
          onValueChange={(v) => { if (v !== null) onChange({ ...filters, transaction_type: v === 'all' ? undefined : v as Filters['transaction_type'] }); }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {TRANSACTION_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t === 'venda' ? 'Venda' : 'Aluguel'}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Imóvel</Label>
        <Select
          value={filters.property_type || 'all'}
          onValueChange={(v) => { if (v !== null) onChange({ ...filters, property_type: v === 'all' ? undefined : v as Filters['property_type'] }); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {PROPERTY_TYPES.map(t => (
              <SelectItem key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Quartos</Label>
        <Select
          value={String(filters.bedrooms || 'any')}
          onValueChange={(v) => { if (v !== null) onChange({ ...filters, bedrooms: v === 'any' ? undefined : Number(v) }); }}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">-</SelectItem>
            {[1,2,3,4].map(n => (
              <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Preço mín.</Label>
        <Input
          type="number"
          placeholder="0"
          className="w-28"
          value={filters.min_price ? filters.min_price / 100 : ''}
          onChange={(e) => onChange({ ...filters, min_price: e.target.value ? Number(e.target.value) * 100 : undefined })}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Preço máx.</Label>
        <Input
          type="number"
          placeholder="Sem limite"
          className="w-28"
          value={filters.max_price ? filters.max_price / 100 : ''}
          onChange={(e) => onChange({ ...filters, max_price: e.target.value ? Number(e.target.value) * 100 : undefined })}
        />
      </div>

      <Button variant="outline" size="sm" onClick={() => onChange({})}>Limpar</Button>
    </div>
  );
}
