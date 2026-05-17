'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { ListingCard } from '@/components/listing/listing-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import type { Listing } from '@/domains/listing/types';
import Link from 'next/link';

export default function MeusAnunciosPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/meus-anuncios'); return; }

    fetch('/api/listings')
      .then(res => res.json())
      .then(json => { setListings(json.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Meus Anúncios</h1>
        <Button render={<Link href="/anunciar" />}>
          <Plus className="mr-2 h-4 w-4" />Novo anúncio
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Nenhum anúncio ainda</h2>
          <p className="text-muted-foreground mb-4">Comece a anunciar seus imóveis gratuitamente.</p>
          <Button render={<Link href="/anunciar" />}>
            Criar primeiro anúncio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing.id} className="relative">
              <Badge className="absolute top-2 right-2 z-10" variant={listing.status === 'active' ? 'default' : 'secondary'}>
                {listing.status}
              </Badge>
              <ListingCard
                slug={listing.slug}
                title={listing.title}
                transaction_type={listing.transaction_type}
                property_type={listing.property_type}
                price_cents={listing.price_cents}
                area_m2={listing.area_m2}
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                parking_spots={listing.parking_spots}
                address_neighborhood={listing.address_neighborhood}
                address_city={listing.address_city}
                photos={listing.photos}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
