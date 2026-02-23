'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'seller')[];
    requireApproved?: boolean;
}

export function RoleGuard({ children, allowedRoles, requireApproved = false }: RoleGuardProps) {
    const { user, isAdmin, isApprovedSeller, isPending, authStatus, profileStatus } = useAuth();
    const router = useRouter();

    const isLoading = authStatus === 'booting' || authStatus === 'authenticating' || profileStatus === 'loading';

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/entrar');
            return;
        }

        if (allowedRoles) {
            if (allowedRoles.includes('admin') && isAdmin) return;
            if (allowedRoles.includes('seller') && (isApprovedSeller || isPending)) {
                if (requireApproved && !isApprovedSeller) {
                    router.push('/ativacao');
                }
                return;
            }

            // If none of the allowed role conditions are met
            router.push('/');
        }
    }, [user, isAdmin, isApprovedSeller, isPending, isLoading, allowedRoles, requireApproved, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <Card className="w-full max-w-md border-none shadow-none text-center">
                    <CardContent className="pt-6">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
                        <p className="text-muted-foreground">Verificando permissões...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) return null;

    if (allowedRoles) {
        const hasAdmin = allowedRoles.includes('admin') && isAdmin;
        const hasSeller = allowedRoles.includes('seller') && (isApprovedSeller || isPending);

        if (!hasAdmin && !hasSeller) return null;
        if (requireApproved && allowedRoles.includes('seller') && !isApprovedSeller && !isAdmin) return null;
    }

    return <>{children}</>;
}
