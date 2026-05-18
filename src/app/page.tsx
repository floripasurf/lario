import Link from 'next/link';
import { Hero } from '@/components/landing/hero';
import { PainPoints } from '@/components/landing/pain-points';
import { HowItWorks } from '@/components/landing/how-it-works';
import { PricingPreview } from '@/components/landing/pricing-preview';
import { BrokerCTA } from '@/components/landing/broker-cta';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ArrowRight, Building2, Home, Warehouse, Key, Tag } from 'lucide-react';

function FeaturedListings() {
  const categories = [
    { icon: Tag, label: 'Comprar', count: 'Casas e apartamentos a venda', href: '/buscar?transaction=venda' },
    { icon: Key, label: 'Alugar', count: 'Imóveis para locação', href: '/buscar?transaction=aluguel' },
    { icon: Home, label: 'Casas', count: 'Explore casas', href: '/buscar?type=casa' },
    { icon: Building2, label: 'Apartamentos', count: 'Explore aptos', href: '/buscar?type=apartamento' },
    { icon: Warehouse, label: 'Comercial', count: 'Salas e lojas', href: '/buscar?type=sala_comercial' },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Explore</p>
            <h2 className="text-3xl md:text-4xl font-bold">O que você procura?</h2>
          </div>
          <Link href="/buscar" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map(({ icon: Icon, label, count, href }) => (
            <Link
              key={label}
              href={href}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 md:p-8 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{label}</h3>
              <p className="text-sm text-muted-foreground">{count}</p>
              <ArrowRight className="absolute top-6 right-6 md:top-8 md:right-8 h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          ))}
        </div>

        <Link href="/buscar" className="flex md:hidden items-center justify-center gap-1 text-sm font-medium text-primary hover:text-primary/80 mt-6 transition-colors">
          Ver todos os imóveis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <FeaturedListings />
        <HowItWorks />
        <PricingPreview />
        <BrokerCTA />
      </main>
      <Footer />
    </>
  );
}
