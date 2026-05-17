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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {transaction_type === 'venda' ? 'Venda' : 'Aluguel'}
          </Badge>
        </div>
        <CardContent className="p-4">
          <p className="text-xl font-bold text-primary">{formatBRL(price_cents)}</p>
          {transaction_type === 'aluguel' && <span className="text-sm text-muted-foreground">/mês</span>}
          <h3 className="font-medium mt-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{address_neighborhood}, {address_city}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {bedrooms > 0 && (
              <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{bedrooms}</span>
            )}
            {bathrooms > 0 && (
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{bathrooms}</span>
            )}
            {parking_spots > 0 && (
              <span className="flex items-center gap-1"><Car className="h-4 w-4" />{parking_spots}</span>
            )}
            <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{area_m2}m²</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
