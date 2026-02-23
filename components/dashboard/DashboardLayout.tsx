'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, ChevronRight, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

// We'll use a placeholder for the logo if logoPng is not easily accessible via import
// Actually, it was moved to assets/logo.png.
const logoPath = '/assets/logo.png';

export type DashboardNavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

type DashboardLayoutProps = {
  role: 'admin' | 'seller';
  navItems: DashboardNavItem[];
  basePath: string;
  children?: React.ReactNode;
};

export function DashboardLayout({ navItems, basePath, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const currentLabel = navItems.find((i) =>
    i.path === basePath
      ? pathname === basePath
      : pathname.startsWith(i.path)
  )?.label ?? 'Painel';

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link
          href={basePath}
          className="flex items-center focus:outline-none"
          onClick={() => setMobileOpen(false)}
        >
          {/* Use standard img tag for simplicity or Next Image if preferred */}
          <img
            src={logoPath}
            alt={APP_NAME}
            className="h-9 w-auto rounded object-contain sm:h-10"
          />
        </Link>
        <div className="flex items-center gap-1">
          <AppButton
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden shrink-0 sm:flex"
            aria-label={sidebarOpen ? 'Recolher menu' : 'Expandir menu'}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </AppButton>
          <AppButton
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="sm:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </AppButton>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const isActive =
            item.path === basePath
              ? pathname === basePath
              : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-2">
        {sidebarOpen && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="truncate text-xs font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        )}
        <AppButton
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start gap-2 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {sidebarOpen && 'Sair'}
        </AppButton>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden flex-col border-r bg-card transition-all duration-300 sm:flex',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 sm:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 sm:px-6">
          <AppButton
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </AppButton>
          <h1 className="min-w-0 truncate text-lg font-semibold">{currentLabel}</h1>
          <Link
            href="/"
            className="ml-auto shrink-0 text-sm text-muted-foreground hover:text-foreground"
          >
            Ver site →
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
