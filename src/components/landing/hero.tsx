import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.06] via-background to-background py-24 md:py-36 lg:py-44">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute top-20 -left-20 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
          <MapPin className="h-3.5 w-3.5" />
          Florianópolis e região
        </div>

        <h1 className="mb-6 animate-fade-in-up">
          Cansou de pagar caro{' '}
          <span className="text-primary relative">
            para anunciar?
            <svg className="absolute -bottom-1 left-0 w-full h-2 text-primary/30" viewBox="0 0 100 8" preserveAspectRatio="none">
              <path d="M0 7 Q25 0 50 4 Q75 8 100 2" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Anuncie grátis. Pague só quando fechar negócio.
          Busque por mapa, não por bairro. Sem mensalidade, sem reajuste surpresa.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Button size="lg" nativeButton={false} className="h-12 px-6 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" render={<Link href="/buscar?transaction=venda" />}>
            <Search className="mr-2 h-5 w-5" />
            Quero comprar
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} className="h-12 px-6 text-base hover:bg-primary/5 transition-all duration-300" render={<Link href="/buscar?transaction=aluguel" />}>
            <Search className="mr-2 h-5 w-5" />
            Quero alugar
          </Button>
        </div>

        <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button size="sm" variant="ghost" nativeButton={false} className="text-muted-foreground hover:text-primary" render={<Link href="/anunciar" />}>
            Sou corretor / quero anunciar
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <span>Zero mensalidade</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Venda e aluguel</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Taxa só no sucesso</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Busca por mapa</span>
        </div>
      </div>
    </section>
  );
}
