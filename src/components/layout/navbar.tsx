'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthContext } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Search, Plus, User, LogOut, Tag, Key } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuthContext();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/buscar?transaction=venda', label: 'Comprar', icon: Tag },
    { href: '/buscar?transaction=aluguel', label: 'Alugar', icon: Key },
    { href: '/buscar', label: 'Buscar', icon: Search },
    ...(user ? [
      { href: '/anunciar', label: 'Anunciar', icon: Plus },
      { href: '/meus-anuncios', label: 'Meus Anúncios', icon: Home },
      { href: '/perfil', label: 'Perfil', icon: User },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/images/logo-mark.svg" alt="Lario" width={32} height={32} className="transition-transform duration-200 group-hover:scale-105" />
          <span className="text-xl font-bold tracking-tight text-foreground">Lario</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/60 transition-all duration-200">
              {label}
            </Link>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">{profile?.full_name?.split(' ')[0]}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
                Entrar
              </Button>
              <Button size="sm" className="shadow-sm" nativeButton={false} render={<Link href="/register" />}>
                Cadastrar
              </Button>
            </div>
          )}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex items-center gap-2 mb-8 mt-4">
              <Image src="/images/logo-mark.svg" alt="Lario" width={32} height={32} />
              <span className="text-xl font-bold tracking-tight">Lario</span>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-muted transition-colors duration-200">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </Link>
              ))}
              <div className="h-px bg-border my-3" />
              {user ? (
                <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors duration-200">
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="flex items-center justify-center text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-muted transition-colors duration-200">
                    Entrar
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="flex items-center justify-center text-sm font-medium px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                    Cadastrar
                  </Link>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
