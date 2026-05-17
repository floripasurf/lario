import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ListingService } from '@/domains/listing/service';
import { ListingGallery } from '@/components/listing/listing-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bed, Bath, Car, Maximize, MapPin, Phone, User } from 'lucide-react';
import { formatBRL } from '@/lib/fees/calculator';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const service = new ListingService(supabase);
  const listing = await service.getBySlug(slug);

  if (!listing) return { title: 'Imóvel não encontrado' };

  return {
    title: `${listing.title} - ${listing.address_city}`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: `${formatBRL(listing.price_cents)} - ${listing.address_neighborhood}, ${listing.address_city}`,
      images: listing.photos[0] ? [{ url: listing.photos[0] }] : [],
    },
  };
}

const PROPERTY_LABELS: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', cobertura: 'Cobertura',
  terreno: 'Terreno', sala_comercial: 'Sala Comercial', loja: 'Loja',
  galpao: 'Galpão', sitio: 'Sítio', chacara: 'Chácara', fazenda: 'Fazenda',
};

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const service = new ListingService(supabase);
  const listing = await service.getBySlug(slug);

  if (!listing) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <ListingGallery photos={listing.photos} title={listing.title} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{listing.transaction_type === 'venda' ? 'Venda' : 'Aluguel'}</Badge>
              <Badge variant="outline">{PROPERTY_LABELS[listing.property_type] || listing.property_type}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {listing.address_neighborhood}, {listing.address_city} - {listing.address_state}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{formatBRL(listing.price_cents)}</span>
            {listing.transaction_type === 'aluguel' && <span className="text-muted-foreground">/mês</span>}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {listing.bedrooms > 0 && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <Bed className="h-5 w-5 mx-auto mb-1" />
                <p className="font-semibold">{listing.bedrooms}</p>
                <p className="text-xs text-muted-foreground">Quartos</p>
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <Bath className="h-5 w-5 mx-auto mb-1" />
                <p className="font-semibold">{listing.bathrooms}</p>
                <p className="text-xs text-muted-foreground">Banheiros</p>
              </div>
            )}
            {listing.parking_spots > 0 && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <Car className="h-5 w-5 mx-auto mb-1" />
                <p className="font-semibold">{listing.parking_spots}</p>
                <p className="text-xs text-muted-foreground">Vagas</p>
              </div>
            )}
            <div className="text-center p-3 bg-muted rounded-lg">
              <Maximize className="h-5 w-5 mx-auto mb-1" />
              <p className="font-semibold">{listing.area_m2}</p>
              <p className="text-xs text-muted-foreground">m²</p>
            </div>
          </div>

          {(listing.condo_fee_cents || listing.iptu_cents) && (
            <div className="flex gap-6 text-sm">
              {listing.condo_fee_cents && (
                <div><span className="text-muted-foreground">Condomínio:</span> {formatBRL(listing.condo_fee_cents)}</div>
              )}
              {listing.iptu_cents && (
                <div><span className="text-muted-foreground">IPTU:</span> {formatBRL(listing.iptu_cents)}/ano</div>
              )}
            </div>
          )}

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-3">Descrição</h2>
            <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
          </div>

          {listing.features.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Características</h2>
              <div className="flex flex-wrap gap-2">
                {listing.features.map((f, i) => (
                  <Badge key={i} variant="secondary">{f}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Contact */}
        <div className="space-y-4">
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="font-semibold mb-4">Contato</h3>
            {listing.owner && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{listing.owner.full_name}</span>
                </div>
                {listing.owner.creci_number && (
                  <p className="text-xs text-muted-foreground">CRECI: {listing.owner.creci_number}</p>
                )}
                <Button className="w-full" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Ver telefone
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
