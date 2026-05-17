import { Search } from 'lucide-react';

interface EmptyStateProps {
  expanded?: boolean;
  radiusKm?: number;
}

export function EmptyState({ expanded, radiusKm }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {expanded
          ? `Buscamos em um raio de ${radiusKm}km e não encontramos resultados. Tente ajustar os filtros ou buscar em outra região.`
          : 'Tente buscar em outro endereço ou ajustar os filtros.'}
      </p>
    </div>
  );
}
