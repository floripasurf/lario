import { DollarSign, Share2, Scale, Map, Heart } from 'lucide-react';

const vantagens = [
  {
    icon: DollarSign,
    title: 'Anuncie agora, pague só quando vender',
    description: 'Crie seu anúncio grátis, com fotos e descrição. Você só paga uma taxa fixa quando o negócio realmente acontecer.',
    highlight: 'R$ 0 para anunciar',
  },
  {
    icon: Share2,
    title: 'Divulgue seu link e receba contatos',
    description: 'Cada anúncio tem um link exclusivo. Compartilhe nas redes sociais, grupos e onde quiser — sem pagar nada por isso.',
    highlight: 'Seu link, seu alcance',
  },
  {
    icon: Scale,
    title: 'Preço justo e regras claras',
    description: 'Chega de mensalidades abusivas e reajustes surpresa. Na Lario a taxa é fixa, publicada e revisada com transparência.',
    highlight: 'Sem letra miúda',
  },
  {
    icon: Map,
    title: 'Busca inteligente encontra seu imóvel',
    description: 'O comprador busca por mapa com raio, não por bairro. Seu imóvel aparece para quem está realmente por perto.',
    highlight: 'Busca por mapa',
  },
  {
    icon: Heart,
    title: 'Grátis para quem mais precisa',
    description: 'Imóveis populares de até R$ 100 mil são grátis para sempre. Pessoa física e proprietário direto não pagam nada.',
    highlight: 'Imóvel popular = grátis',
  },
];

export function PainPoints() {
  return (
    <section className="py-18 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#F47520] uppercase tracking-wider mb-3">Vantagens da Lario</p>
          <h2 className="max-w-3xl mx-auto">
            Não fique refém dos grandes portais
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Preço justo, regras claras e liberdade para divulgar seu imóvel do seu jeito.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 md:grid-cols-2 lg:grid-cols-3">
          {vantagens.map(({ icon: Icon, title, description, highlight }) => (
            <div
              key={title}
              className="group relative bg-card p-6 transition-colors duration-300 hover:bg-secondary/45"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-[#F47520]/10 transition-colors duration-300">
                <Icon className="h-5 w-5 text-primary group-hover:text-[#F47520] transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
              <span className="inline-block rounded-md bg-[#F47520]/12 px-2.5 py-1 text-xs font-semibold text-[#D45A10]">
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
