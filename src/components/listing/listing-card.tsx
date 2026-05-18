import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Car, Maximize } from 'lucide-react';
import { formatBRL } from '@/lib/fees/calculator';

interface ListingCardProps {
  slug: string;
  title: string;
  transaction_type: string;
  property_type: string;
  price_cents: number;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  address_neighborhood: string;
  address_city: string;
  photos: string[];
}

export function ListingCard({
  slug, title, transaction_type, price_cents, area_m2,
  bedrooms, bathrooms, parking_spots, address_neighborhood,
  address_city, photos,
}: ListingCardProps) {
  const imageUrl = photos[0] || '/images/placeholder.svg';

  return (
    <Link href={`/imovel/${slug}`}>
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg hover:shadow-primary/[0.06] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge className="absolute top-3 left-3 shadow-sm backdrop-blur-sm bg-white/90 text-foreground border-0 font-medium text-xs">
            {transaction_type === 'venda' ? 'Venda' : 'Aluguel'}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl font-bold text-primary tracking-tight">{formatBRL(price_cents)}</p>
            {transaction_type === 'aluguel' && <span className="text-sm text-muted-foreground">/mês</span>}
          </div>
          <h3 className="font-medium mt-1.5 line-clamp-1 text-foreground/90">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{address_neighborhood}, {address_city}</p>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
            {bedrooms > 0 && (
              <span className="flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" />{bedrooms}</span>
            )}
            {bathrooms > 0 && (
              <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" />{bathrooms}</span>
            )}
            {parking_spots > 0 && (
              <span className="flex items-center gap-1.5"><Car className="h-3.5 w-3.5" />{parking_spots}</span>
            )}
            <span className="flex items-center gap-1.5 ml-auto font-medium text-foreground/70"><Maximize className="h-3.5 w-3.5" />{area_m2} m²</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
