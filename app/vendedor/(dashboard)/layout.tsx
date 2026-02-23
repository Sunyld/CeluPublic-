'use client';

import { LayoutDashboard, Package, Settings } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

import { RoleGuard } from '@/components/providers/RoleGuard';

export default function VendedorRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['seller', 'admin']} requireApproved={true}>
            <DashboardLayout
                role="seller"
                navItems={[
                    { path: '/vendedor', label: 'Meu painel', icon: LayoutDashboard },
                    { path: '/vendedor/anuncios', label: 'Meus anúncios', icon: Package },
                    { path: '/vendedor/configuracoes', label: 'Configurações', icon: Settings },
                ]}
                basePath="/vendedor"
            >
                {children}
            </DashboardLayout>
        </RoleGuard>
    );
}
