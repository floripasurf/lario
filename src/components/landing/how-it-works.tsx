import { Upload, Share2, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Crie seu anúncio grátis',
    description: 'Cadastre seu imóvel com fotos e descrição completa. Sem custo, sem contrato e sem fidelidade. Venda ou aluguel.',
  },
  {
    icon: Share2,
    title: 'Divulgue o link do anúncio',
    description: 'Compartilhe o link exclusivo do seu anúncio nas redes sociais, WhatsApp e grupos. Interessados falam direto com você.',
  },
  {
    icon: DollarSign,
    title: 'Pague só quando fechar negócio',
    description: 'Taxa fixa e transparente, cobrada apenas quando a venda ou aluguel acontecer. Sem mensalidade, sem surpresa.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-18 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#F47520] uppercase tracking-wider mb-3">Simples e transparente</p>
          <h2>Como funciona</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="group border-l border-border/80 pl-6">
              <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                <Icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#F47520] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
