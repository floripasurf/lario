import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Lario</h3>
            <p className="text-sm text-muted-foreground">
              Portal imobiliário gratuito. Anuncie grátis, pague só se vender.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/buscar" className="text-muted-foreground hover:text-foreground">Buscar imóveis</Link></li>
              <li><Link href="/anunciar" className="text-muted-foreground hover:text-foreground">Anunciar grátis</Link></li>
              <li><Link href="/register" className="text-muted-foreground hover:text-foreground">Criar conta</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Florianópolis, SC</li>
              <li>contato@lario.com.br</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lario. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
