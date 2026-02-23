import { LayoutDashboard, Users, Package, Layers, Image } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export function AdminLayout() {
  return (
    <DashboardLayout
      role="admin"
      navItems={[
        { path: '/admin', label: 'Visão geral', icon: LayoutDashboard },
        { path: '/admin/usuarios', label: 'Utilizadores', icon: Users },
        { path: '/admin/anuncios', label: 'Anúncios', icon: Package },
        { path: '/admin/categorias', label: 'Categorias', icon: Layers },
        { path: '/admin/banners', label: 'Banners', icon: Image },
      ]}
      basePath="/admin"
    />
  );
}
