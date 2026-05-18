import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ListingService } from '@/domains/listing/service';
import { ListingGallery } from '@/components/listing/listing-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bed, Bath, Car, Maximize, MapPin, User } from 'lucide-react';
import { formatBRL } from '@/lib/fees/calculator';
import { WhatsAppButton } from '@/components/listing/whatsapp-button';

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
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl animate-fade-in">
      <ListingGallery photos={listing.photos} title={listing.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-0 font-medium">{listing.transaction_type === 'venda' ? 'Venda' : 'Aluguel'}</Badge>
              <Badge variant="outline" className="font-medium">{PROPERTY_LABELS[listing.property_type] || listing.property_type}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">{listing.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1.5 mt-3 text-sm">
              <MapPin className="h-4 w-4 text-primary/60 shrink-0" />
              {listing.address_neighborhood}, {listing.address_city} - {listing.address_state}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <span className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{formatBRL(listing.price_cents)}</span>
            {listing.transaction_type === 'aluguel' && <span className="text-muted-foreground text-lg">/mês</span>}
          </div>

          {/* Property features grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {listing.bedrooms > 0 && (
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/70 hover:shadow-sm transition-all duration-200 group">
                <Bed className="h-5 w-5 mx-auto mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="font-bold text-lg">{listing.bedrooms}</p>
                <p className="text-xs text-muted-foreground">Quartos</p>
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/70 hover:shadow-sm transition-all duration-200 group">
                <Bath className="h-5 w-5 mx-auto mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="font-bold text-lg">{listing.bathrooms}</p>
                <p className="text-xs text-muted-foreground">Banheiros</p>
              </div>
            )}
            {listing.parking_spots > 0 && (
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/70 hover:shadow-sm transition-all duration-200 group">
                <Car className="h-5 w-5 mx-auto mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="font-bold text-lg">{listing.parking_spots}</p>
                <p className="text-xs text-muted-foreground">Vagas</p>
              </div>
            )}
            <div className="text-center p-4 bg-muted/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/70 hover:shadow-sm transition-all duration-200 group">
              <Maximize className="h-5 w-5 mx-auto mb-2 text-primary/70 group-hover:text-primary transition-colors" />
              <p className="font-bold text-lg">{listing.area_m2}</p>
              <p className="text-xs text-muted-foreground">m&sup2;</p>
            </div>
          </div>

          {/* Extra costs */}
          {(listing.condo_fee_cents || listing.iptu_cents) && (
            <div className="flex flex-wrap gap-6 text-sm bg-muted/30 rounded-xl p-5 border border-border/50">
              {listing.condo_fee_cents && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Condomínio:</span>
                  <span className="font-semibold">{formatBRL(listing.condo_fee_cents)}</span>
                </div>
              )}
              {listing.iptu_cents && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">IPTU:</span>
                  <span className="font-semibold">{formatBRL(listing.iptu_cents)}/ano</span>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Descrição</h2>
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed text-[0.95rem]">{listing.description}</div>
          </div>

          {/* Features */}
          {listing.features.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Características</h2>
              <div className="flex flex-wrap gap-2">
                {listing.features.map((f, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm font-normal hover:bg-secondary/80 transition-colors">{f}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Contact (sticky on desktop) */}
        <div className="lg:relative">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
              <h3 className="font-semibold text-lg mb-5">Fale com o anunciante</h3>
              {listing.owner && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3.5 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/5">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold block">{listing.owner.full_name}</span>
                      {listing.owner.creci_number && (
                        <p className="text-xs text-muted-foreground mt-0.5">CRECI: {listing.owner.creci_number}</p>
                      )}
                    </div>
                  </div>
                  <WhatsAppButton
                    phone={listing.owner.phone}
                    listingId={listing.id}
                    listingTitle={listing.title}
                    className="w-full h-12 text-base"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    Sem cadastro necessário. Fale direto pelo WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile: Fixed bottom CTA bar */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background/95 backdrop-blur-md border-t border-border/50 p-4 z-40 shadow-[0_-4px_20px_rgb(0_0_0/0.05)]">
              <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-primary truncate">{formatBRL(listing.price_cents)}</p>
                  {listing.transaction_type === 'aluguel' && <span className="text-xs text-muted-foreground">/mês</span>}
                </div>
                {listing.owner && (
                  <WhatsAppButton
                    phone={listing.owner.phone}
                    listingId={listing.id}
                    listingTitle={listing.title}
                    className="h-11 px-6 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile fixed bottom bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}
