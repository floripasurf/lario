import { Upload, MapPin, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Anuncie grátis',
    description: 'Cadastre seu imóvel com fotos e descrição. Sem custo nenhum para publicar.',
  },
  {
    icon: MapPin,
    title: 'Apareça no mapa',
    description: 'Compradores encontram seu imóvel buscando por localização no mapa interativo.',
  },
  {
    icon: DollarSign,
    title: 'Pague só se vender',
    description: 'Taxa de sucesso de apenas 1,5% sobre o valor da venda. Sem mensalidade.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
