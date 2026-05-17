import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Encontre seu imóvel em{' '}
          <span className="text-primary">Florianópolis</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Anuncie grátis, pague só se vender. Busque por mapa com raio geográfico e encontre o imóvel ideal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" render={<Link href="/buscar" />}>
            <Search className="mr-2 h-5 w-5" />
            Buscar imóveis
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/anunciar" />}>
            Anunciar grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
