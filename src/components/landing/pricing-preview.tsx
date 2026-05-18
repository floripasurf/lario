import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const vendaRows = [
  { range: 'Até R$ 100 mil', pf: 'Grátis', corretor: 'R$ 49' },
  { range: 'R$ 100–300 mil', pf: 'R$ 99', corretor: 'R$ 199' },
  { range: 'R$ 300–600 mil', pf: '-', corretor: 'R$ 349' },
  { range: 'R$ 600 mil–1M', pf: '-', corretor: 'R$ 549' },
  { range: 'R$ 1–2M', pf: '-', corretor: 'R$ 849' },
  { range: 'Acima de R$ 2M', pf: '-', corretor: 'A partir de R$ 1.297' },
];

const aluguelRows = [
  { range: 'Até R$ 1.500/mês', fee: 'R$ 49' },
  { range: 'R$ 1.500–3.000/mês', fee: 'R$ 99' },
  { range: 'R$ 3.000–6.000/mês', fee: 'R$ 199' },
  { range: 'Acima de R$ 6.000/mês', fee: 'R$ 349' },
];

const benefits = [
  'Anúncios ilimitados',
  'Sem mensalidade',
  'Sem contrato ou fidelidade',
  'Sem reajuste surpresa',
  'Paga só quando fechar negócio',
];

export function PricingPreview() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Transparência total</p>
          <h2 className="text-3xl md:text-4xl font-bold">Taxa só no sucesso</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Você só paga quando o negócio fecha. Sempre mais barato que qualquer portal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Venda table */}
          <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
              <h3 className="font-semibold text-lg">Venda de imóveis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">Faixa do imóvel</th>
                    <th className="text-center px-6 py-3 font-medium text-muted-foreground">Pessoa Física</th>
                    <th className="text-center px-6 py-3 font-medium text-muted-foreground">Corretor (CRECI)</th>
                  </tr>
                </thead>
                <tbody>
                  {vendaRows.map((row, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">
                      <td className="px-6 py-3 font-medium">{row.range}</td>
                      <td className="px-6 py-3 text-center">
                        {row.pf === 'Grátis' ? (
                          <span className="text-primary font-semibold">Grátis</span>
                        ) : row.pf}
                      </td>
                      <td className="px-6 py-3 text-center">{row.corretor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-border/50 bg-muted/30">
              <h3 className="font-semibold text-lg mb-3">Aluguel</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aluguelRows.map((row, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{row.range}</p>
                    <p className="font-semibold">{row.fee}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits card */}
          <div className="rounded-2xl border border-primary/20 bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">Incluso para todos</h3>
            <ul className="space-y-3 mb-6">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
            <Button nativeButton={false} className="w-full" render={<Link href="/register" />}>
              Criar conta grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Tabela revisada trimestralmente com 30 dias de antecipação
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
