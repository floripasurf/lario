import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Home, Bed, Bath, Maximize, Share2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(135deg,oklch(0.97_0.008_250)_0%,oklch(0.99_0.003_250)_46%,oklch(0.93_0.03_240)_100%)]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-12 px-4 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-18 lg:gap-16">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
            <MapPin className="h-3.5 w-3.5" />
            Florianópolis e região
          </div>

          <h1 className="mb-6 text-balance">
            Anuncie agora e pague somente quando vender!
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
            Divulgue o link do seu anúncio na Lario e não pague nada para anunciar. Simples assim.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} className="h-13 px-6 text-base shadow-lg shadow-primary/20" render={<Link href="/anunciar" />}>
              Anunciar grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} className="h-13 border-primary/20 bg-white/70 px-6 text-base hover:bg-white" render={<Link href="/buscar" />}>
              Buscar imóveis
            </Button>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-border/70 rounded-xl border border-border/70 bg-white/65 py-4 text-center shadow-sm backdrop-blur">
            <div>
              <p className="text-lg font-bold text-[#F47520]">Grátis</p>
              <p className="text-xs text-muted-foreground">para anunciar</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Mapa</p>
              <p className="text-xs text-muted-foreground">busca inteligente</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Justo</p>
              <p className="text-xs text-muted-foreground">pague só no sucesso</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <div className="absolute inset-x-4 top-10 h-[420px] rotate-[-2deg] rounded-2xl bg-[linear-gradient(145deg,#0B2265,#1E55B0)] shadow-2xl shadow-primary/20" />
          <div className="relative ml-auto max-w-xl overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-primary/15">
            <div className="relative h-72 bg-[linear-gradient(135deg,#d4dff0_0%,#f0ece0_52%,#6a9cd4_100%)]">
              <div className="absolute inset-0 opacity-45" style={{ backgroundImage: 'linear-gradient(120deg, transparent 0 48%, rgba(255,255,255,.7) 49% 51%, transparent 52%), linear-gradient(35deg, transparent 0 55%, rgba(11,34,101,.25) 56% 58%, transparent 59%)', backgroundSize: '120px 120px, 160px 160px' }} />
              <div className="absolute left-8 top-10 h-36 w-56 rounded-xl bg-[#f4f6fa] shadow-xl">
                <div className="h-16 rounded-t-xl bg-[#0B2265]" />
                <div className="grid grid-cols-3 gap-2 p-4">
                  <span className="h-10 rounded bg-[#F47520]/80" />
                  <span className="h-10 rounded bg-primary/20" />
                  <span className="h-10 rounded bg-primary/20" />
                </div>
              </div>
              <div className="absolute bottom-9 right-9 h-40 w-48 rounded-xl bg-white/85 p-3 shadow-xl backdrop-blur">
                <div className="h-full rounded-lg bg-[linear-gradient(160deg,#c8d6ea,#f6f4ee_48%,#5889c0)]" />
              </div>
              <div className="absolute left-[47%] top-[46%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F47520] text-white shadow-lg shadow-[#F47520]/30">
                <Home className="h-5 w-5" />
              </div>
            </div>
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">Apartamento em Coqueiros</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">R$ 742.000</p>
                </div>
                <span className="rounded-full bg-[#F47520]/15 px-3 py-1 text-xs font-semibold text-[#D45A10]">Venda</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2"><Bed className="h-4 w-4" />3</span>
                <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2"><Bath className="h-4 w-4" />2</span>
                <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2"><Maximize className="h-4 w-4" />96 m²</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 max-w-xs rounded-xl border border-border/70 bg-white/90 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F47520]/10 text-[#F47520]">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Compartilhe seu link</p>
                <p className="text-xs text-muted-foreground">Divulgue e receba interessados direto.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
