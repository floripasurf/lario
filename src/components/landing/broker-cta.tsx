import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Check } from 'lucide-react';

const hooks = [
  'Anúncios ilimitados, sempre grátis',
  '3 primeiras vendas com taxa zero',
  'Sem mensalidade, sem pacote, sem venda casada',
  'Reputação que valoriza quem trabalha direito',
  'Selo CRECI verificado para seus clientes',
];

export function BrokerCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground rounded-3xl p-8 md:p-14 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Corretor: chega de pagar R$ 3.000/mês por lead frio
              </h2>
              <p className="text-lg opacity-90 leading-relaxed">
                Os grandes portais cobram caro, reajustam sem avisar e entregam contatos que nunca compram. Na Lario você anuncia de graça e só paga quando fechar negócio.
              </p>
            </div>

            <div>
              <ul className="space-y-3 mb-8">
                {hooks.map((hook) => (
                  <li key={hook} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium opacity-95">{hook}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="secondary" nativeButton={false} className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300" render={<Link href="/register" />}>
                Cadastrar meu CRECI
              </Button>
              <p className="text-xs opacity-70 mt-3">Cadastro em 2 minutos. Sem cartão de crédito.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
