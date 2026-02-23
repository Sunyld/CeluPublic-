'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Loader2 } from 'lucide-react';
import { AppButton } from '@/components/ui/app-button';

export default function PosLogin() {
    const { user, authStatus, profileStatus, getPostLoginRedirect, logout, authError } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authStatus === 'authenticated' && profileStatus === 'ready' && user) {
            const target = getPostLoginRedirect(user);
            router.replace(target);
        } else if (authStatus === 'anonymous') {
            router.replace('/entrar');
        }
    }, [user, authStatus, profileStatus, getPostLoginRedirect, router]);

    if (profileStatus === 'error') {
        return (
            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-destructive" />
                    </div>
                    <h1 className="text-xl font-semibold">Erro ao carregar perfil</h1>
                    <p className="text-sm text-muted-foreground">
                        {authError || 'Ocorreu um problema ao preparar o seu acesso. Por favor, tente novamente.'}
                    </p>
                    <div className="flex flex-col gap-2">
                        <AppButton onClick={() => window.location.reload()}>
                            Tentar Novamente
                        </AppButton>
                        <AppButton variant="ghost" onClick={() => logout()}>
                            Sair e entrar com outra conta
                        </AppButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground font-medium">A preparar o teu acesso...</p>
                <p className="mt-1 text-xs text-muted-foreground">Isso deve levar apenas alguns segundos.</p>
            </div>
        </div>
    );
}
