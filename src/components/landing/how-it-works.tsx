import { Upload, MapPin, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Anuncie grátis',
    description: 'Cadastre seu imóvel com fotos e descrição. Sem custo, sem contrato, sem fidelidade. Venda ou aluguel.',
  },
  {
    icon: MapPin,
    title: 'Busca por mapa, não por bairro',
    description: 'Interessados encontram seu imóvel buscando por raio no mapa. Sem fronteira de bairro escondendo oportunidades.',
  },
  {
    icon: DollarSign,
    title: 'Pague só se fechar negócio',
    description: 'Taxa fixa e transparente, só quando a venda ou aluguel acontecer. Sem mensalidade, sem reajuste surpresa.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Simples e transparente</p>
          <h2 className="text-3xl md:text-4xl font-bold">Como funciona</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="text-center group">
              <div className="relative mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                <Icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
