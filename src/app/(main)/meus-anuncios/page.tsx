'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { ListingCard } from '@/components/listing/listing-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, TrendingUp } from 'lucide-react';
import type { Listing } from '@/domains/listing/types';
import Link from 'next/link';

interface LeadCounts {
  [listingId: string]: { total_leads: number; leads_7d: number; leads_30d: number };
}

export default function MeusAnunciosPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [leadCounts, setLeadCounts] = useState<LeadCounts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/meus-anuncios'); return; }

    Promise.all([
      fetch('/api/listings').then(res => res.json()),
      fetch('/api/leads/summary').then(res => res.json()).catch(() => ({ data: {} })),
    ]).then(([listingsJson, leadsJson]) => {
      setListings(listingsJson.data || []);
      setLeadCounts(leadsJson.data || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 w-48 bg-muted/70 rounded-lg animate-pulse" />
          <div className="h-8 w-36 bg-muted/70 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[4/3] rounded-xl bg-muted/70 animate-pulse-soft" style={{ animationDelay: `${i * 0.15}s` }} />
              <div className="space-y-2 px-1">
                <div className="h-5 bg-muted/70 rounded-md w-3/4" />
                <div className="h-4 bg-muted/50 rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const STATUS_LABELS: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    sold: 'Vendido',
    rented: 'Alugado',
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Anuncios</h1>
          {listings.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{listings.length} {listings.length === 1 ? 'anuncio' : 'anuncios'}</p>
          )}
        </div>
        <Button nativeButton={false} render={<Link href="/anunciar" />}>
          <Plus className="mr-2 h-4 w-4" />Novo anuncio
        </Button>
      </div>

      {/* Lead stats summary */}
      {listings.length > 0 && Object.keys(leadCounts).length > 0 && (() => {
        const totalLeads = Object.values(leadCounts).reduce((sum, c) => sum + (c.total_leads || 0), 0);
        const leads7d = Object.values(leadCounts).reduce((sum, c) => sum + (c.leads_7d || 0), 0);
        return totalLeads > 0 ? (
          <div className="mb-8 p-5 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  Já repassamos <span className="text-[#25D366] font-bold">{totalLeads}</span> {totalLeads === 1 ? 'interessado' : 'interessados'} para seus imóveis
                </p>
                {leads7d > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{leads7d} nos últimos 7 dias</p>
                )}
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {listings.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-muted/70 flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum anuncio ainda</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Comece a anunciar seus imoveis gratuitamente e alcance compradores interessados.</p>
          <Button nativeButton={false} render={<Link href="/anunciar" />} className="h-11 px-6">
            Criar primeiro anuncio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="relative group animate-fade-in-up hover:ring-1 hover:ring-border rounded-xl transition-all duration-200"
              style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
            >
              <Badge
                className="absolute top-3 right-3 z-10 shadow-sm"
                variant={listing.status === 'active' ? 'default' : 'secondary'}
              >
                {STATUS_LABELS[listing.status] || listing.status}
              </Badge>
              {/* Lead count per listing */}
              {leadCounts[listing.id] && leadCounts[listing.id].total_leads > 0 && (
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium shadow-sm border border-border/50">
                  <Users className="h-3 w-3 text-[#25D366]" />
                  <span>{leadCounts[listing.id].total_leads} {leadCounts[listing.id].total_leads === 1 ? 'interessado' : 'interessados'}</span>
                </div>
              )}
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
