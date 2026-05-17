import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export function BrokerCTA() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">É corretor de imóveis?</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-6">
            Cadastre seu CRECI e tenha acesso a ferramentas exclusivas. Anuncie quantos imóveis quiser, gratuitamente.
          </p>
          <Button size="lg" variant="secondary" render={<Link href="/register" />}>
            Cadastrar como corretor
          </Button>
        </div>
      </div>
    </section>
  );
}
