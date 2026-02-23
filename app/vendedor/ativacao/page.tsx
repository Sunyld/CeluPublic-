'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Phone, Loader2, X } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function VendedorAtivacao() {
    const { user, authStatus, profileStatus, logout, refreshProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authStatus === 'anonymous') {
            router.replace('/entrar');
            return;
        }
        // Fetch fresh profile on mount (picks up recent admin approval)
        refreshProfile();
    }, [authStatus, refreshProfile]);

    useEffect(() => {
        if (authStatus === 'anonymous') return;
        if (user?.status === 'approved') {
            if (process.env.NODE_ENV === 'development') {
                console.log('[ATIVACAO] status lido antes do redirect:', user.status);
            }
            router.replace('/vendedor');
            return;
        }
    }, [user, authStatus, router]);

    if (profileStatus === 'loading' || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Show rejection message if status is rejected
    if (user.status === 'rejected') {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <Card className="border-t-4 border-t-destructive shadow-xl overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                            <X className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-destructive">Conta Rejeitada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4 text-center">
                        <p className="text-muted-foreground">
                            A sua solicitação de ativação foi rejeitada. Entre em contacto com o administrador para mais informações.
                        </p>
                        <div className="pt-4 space-y-4">
                            <AppButton variant="primary" className="w-full h-12 gap-2" asChild>
                                <a href={CONTACT_INFO.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                                    <Phone className="h-5 w-5" /> Contactar Admin no WhatsApp
                                </a>
                            </AppButton>
                            <div className="text-sm text-muted-foreground">
                                <p>Email: {CONTACT_INFO.EMAIL}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 border-t flex justify-center p-6">
                        <AppButton variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive transition-colors">
                            Sair da conta
                        </AppButton>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Pending status: show activation instructions
    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <Card className="border-t-4 border-t-primary shadow-xl overflow-hidden">
                <div className="h-2 bg-primary animate-pulse" />
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Ativação da Conta</CardTitle>
                    <CardDescription className="pt-2">
                        Taxa única de ativação: <span className="font-bold text-primary">20 MT</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 pt-4 text-center">
                    <div className="rounded-2xl border bg-muted/30 p-8 space-y-6">
                        <p className="text-lg font-semibold leading-relaxed">
                            Para ativar sua conta de vendedor/prestador, efetue o pagamento de <span className="text-primary font-black text-xl">20 MT</span> e entre em contacto com o administrador.
                        </p>

                        <div className="pt-4 space-y-3">
                            <div className="text-sm">
                                <p className="font-bold text-foreground mb-2">Contacto do Administrador:</p>
                                <p className="text-primary font-black text-lg">{CONTACT_INFO.WHATSAPP}</p>
                                <p className="text-muted-foreground mt-1">{CONTACT_INFO.EMAIL}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <AppButton variant="primary" className="w-full h-16 gap-3 text-lg font-bold shadow-lg hover:scale-[1.02] transition-all" asChild>
                            <a href={CONTACT_INFO.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                                <Phone className="h-6 w-6" /> Falar com o Admin no WhatsApp
                            </a>
                        </AppButton>
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/10 border-t flex justify-center p-6">
                    <AppButton variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive transition-colors">
                        Sair da conta
                    </AppButton>
                </CardFooter>
            </Card>
        </div>
    );
}
