import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo-mark.svg" alt="Lario" width={28} height={28} />
              <span className="font-bold text-lg tracking-tight">Lario</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Portal imobiliário gratuito para Florianópolis. Venda ou alugue sem pagar para anunciar.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground/70">Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/buscar?transaction=venda" className="text-muted-foreground hover:text-primary transition-colors">Comprar</Link></li>
              <li><Link href="/buscar?transaction=aluguel" className="text-muted-foreground hover:text-primary transition-colors">Alugar</Link></li>
              <li><Link href="/anunciar" className="text-muted-foreground hover:text-primary transition-colors">Anunciar grátis</Link></li>
              <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">Criar conta</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground/70">Contato</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Florianópolis, SC</li>
              <li>contato@lario.com.br</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lario. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
