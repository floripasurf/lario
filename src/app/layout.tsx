import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Lario - Portal Imobiliário | Anuncie Grátis',
    template: '%s | Lario',
  },
  description: 'Encontre seu imóvel em Florianópolis. Anuncie grátis, pague só se vender. Busca por mapa com raio geográfico.',
  keywords: ['imóveis', 'florianópolis', 'comprar', 'alugar', 'apartamento', 'casa', 'portal imobiliário'],
  openGraph: {
    title: 'Lario - Portal Imobiliário',
    description: 'Anuncie grátis, pague só se vender.',
    url: 'https://lario.com.br',
    siteName: 'Lario',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
