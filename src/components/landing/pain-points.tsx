import { TrendingDown, Target, Map, ShieldAlert, Receipt } from 'lucide-react';

const pains = [
  {
    icon: Receipt,
    pain: 'Reajustes abusivos',
    description: 'Os grandes portais aumentam até 300% ao ano e forçam venda casada de pacotes. Na Lario, você não paga nada para anunciar.',
    highlight: 'R$ 0 para publicar',
  },
  {
    icon: TrendingDown,
    pain: 'Leads frios e duplicados',
    description: 'Você paga R$ 1.000–3.000/mês para receber contatos que nunca compram. Aqui você só paga quando o negócio fecha.',
    highlight: 'Pague só no sucesso',
  },
  {
    icon: Target,
    pain: 'PF paga caro sem garantia',
    description: 'Outros portais cobram R$ 350–400 para anunciar um imóvel de R$ 150 mil sem nenhuma garantia de resultado. Na Lario, imóvel até R$ 100 mil é grátis para sempre.',
    highlight: 'Grátis até R$ 100 mil',
  },
  {
    icon: ShieldAlert,
    pain: 'Anúncios falsos por todo lado',
    description: 'Duplicações e iscas que desperdiçam seu tempo. Usamos CPF e CRECI únicos por conta, reputação por histórico e detecção automática.',
    highlight: 'Anti-fraude real',
  },
  {
    icon: Map,
    pain: 'Busca por bairro é limitada',
    description: 'Filtrar por bairro esconde imóveis ótimos a 500m da divisa. Na Lario você busca por mapa com raio — vê tudo que está perto de você.',
    highlight: 'Busca por mapa',
  },
];

export function PainPoints() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Por que a Lario existe</p>
          <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto">
            O mercado imobiliário digital cobra caro e entrega pouco
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Corretores e proprietários estão cansados de pagar mensalidades altas por leads ruins. Criamos uma alternativa justa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pains.map(({ icon: Icon, pain, description, highlight }) => (
            <div
              key={pain}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <Icon className="h-5 w-5 text-destructive group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{pain}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
              <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
