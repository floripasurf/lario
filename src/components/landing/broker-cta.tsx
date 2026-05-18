import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const hooks = [
  'Anúncios ilimitados, sempre grátis',
  'Pague apenas quando fechar negócio',
  'Sem mensalidade, sem pacote, sem surpresa',
  'Imóveis populares até R$ 100 mil totalmente grátis',
  'Compartilhe o link e alcance compradores direto',
];

export function BrokerCTA() {
  return (
    <section className="py-18 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20 md:p-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,.12))] md:block" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Anuncie sem custo e pague só quando vender
              </h2>
              <p className="text-lg opacity-90 leading-relaxed">
                Na Lario você anuncia de graça, divulga do seu jeito e só paga uma taxa fixa quando o negócio acontecer. Sem surpresas, sem reajustes.
              </p>
            </div>

            <div>
              <ul className="space-y-3 mb-8">
                {hooks.map((hook) => (
                  <li key={hook} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F47520]/30 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium opacity-95">{hook}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="secondary" nativeButton={false} className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300" render={<Link href="/register" />}>
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs opacity-70 mt-3">Cadastro em 2 minutos. Sem cartão de crédito.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
