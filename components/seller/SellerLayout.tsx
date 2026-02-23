import { LayoutDashboard, Package, PlusCircle, Settings } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export function SellerLayout() {
  return (
    <DashboardLayout
      role="seller"
      navItems={[
        { path: '/vendedor', label: 'Visão geral', icon: LayoutDashboard },
        { path: '/vendedor/anuncios', label: 'Meus anúncios', icon: Package },
        { path: '/vendedor/novo', label: 'Criar anúncio', icon: PlusCircle },
        { path: '/vendedor/definicoes', label: 'Definições', icon: Settings },
      ]}
      basePath="/vendedor"
    />
  );
}
