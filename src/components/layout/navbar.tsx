'use client';

import Link from 'next/link';
import { useAuthContext } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Search, Plus, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuthContext();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/buscar', label: 'Buscar', icon: Search },
    ...(user ? [
      { href: '/anunciar', label: 'Anunciar', icon: Plus },
      { href: '/meus-anuncios', label: 'Meus Anúncios', icon: Home },
      { href: '/perfil', label: 'Perfil', icon: User },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Lario</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{profile?.full_name?.split(' ')[0]}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Entrar
              </Button>
              <Button size="sm" render={<Link href="/register" />}>
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
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 text-sm font-medium p-2 rounded-md hover:bg-muted">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center gap-3 text-sm font-medium p-2 rounded-md hover:bg-muted text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 text-sm font-medium p-2 rounded-md hover:bg-muted">
                    Entrar
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="flex items-center gap-3 text-sm font-medium p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 justify-center">
                    Cadastrar
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
