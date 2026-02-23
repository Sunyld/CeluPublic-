'use client';

import { LayoutDashboard, Users, Package, Layers, Image, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

import { RoleGuard } from '@/components/providers/RoleGuard';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <DashboardLayout
                role="admin"
                navItems={[
                    { path: '/admin', label: 'Visão geral', icon: LayoutDashboard },
                    { path: '/admin/usuarios', label: 'Utilizadores', icon: Users },
                    { path: '/admin/solicitacoes', label: 'Solicitações', icon: CheckCircle },
                    { path: '/admin/anuncios', label: 'Anúncios', icon: Package },
                    { path: '/admin/categorias', label: 'Categorias', icon: Layers },
                    { path: '/admin/banners', label: 'Banners', icon: Image },
                ]}
                basePath="/admin"
            >
                {children}
            </DashboardLayout>
        </RoleGuard>
    );
}
