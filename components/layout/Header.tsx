'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { AppButton } from '@/components/ui/app-button';
import { BrandLogo } from '@/components/BrandLogo';

export function Header() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isAdmin, isApprovedSeller, isPending } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setUserMenu(false);
    router.push('/');
  };

  const rightNav = (
    <>
      {user ? (
        <div className="relative">
          <AppButton
            variant="ghost"
            size="sm"
            className="max-w-[160px] sm:max-w-[200px] text-sm font-medium text-foreground hover:text-primary"
            onClick={() => setUserMenu(!userMenu)}
            aria-label="Menu da conta"
            aria-expanded={userMenu}
            aria-haspopup="menu"
          >
            <User className="mr-1.5 h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{user.name}</span>
          </AppButton>
          {userMenu && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-background py-1 shadow-lg"
            >
              {(isAdmin || isApprovedSeller) && (
                <Link
                  href={isAdmin ? '/admin' : '/vendedor'}
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none focus-visible:ring-0"
                  onClick={() => { setUserMenu(false); setOpen(false); }}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                  {isAdmin ? 'Admin' : 'Meu painel'}
                </Link>
              )}
              {isPending && (
                <Link
                  href="/ativacao"
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 focus:bg-amber-50 focus:outline-none focus-visible:ring-0"
                  onClick={() => { setUserMenu(false); setOpen(false); }}
                >
                  Ativar conta
                </Link>
              )}
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                role="menuitem"
                className="w-full justify-start gap-2 text-sm font-normal"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                Sair
              </AppButton>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <AppButton variant="default" size="sm" asChild onClick={() => setOpen(false)}>
            <Link href="/entrar">Entrar</Link>
          </AppButton>
          <Link
            href="/ajuda"
            className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setOpen(false)}
          >
            Ajuda
          </Link>
          <AppButton variant="outline" size="sm" asChild onClick={() => setOpen(false)}>
            <Link href="/cadastro">Anunciar</Link>
          </AppButton>
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background">
      <div className="mx-auto flex h-14 min-w-0 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <BrandLogo
          variant="header"
          linkToHome
          className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
          onClick={() => setOpen(false)}
        />

        <div className="hidden min-w-0 md:flex md:items-center md:gap-4 lg:gap-6">
          {rightNav}
        </div>

        <AppButton
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </AppButton>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-border/40 bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2 pt-2">{rightNav}</div>
        </div>
      )}
    </header>
  );
}
