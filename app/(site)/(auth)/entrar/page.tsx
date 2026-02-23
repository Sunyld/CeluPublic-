'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { AppButton } from '@/components/ui/app-button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/ui/google-icon';
import { BrandLogo } from '@/components/BrandLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [oauthStarting, setOauthStarting] = useState(false);

    const { user, login, loginWithGoogle, authStatus, profileStatus, getPostLoginRedirect } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (authStatus === 'authenticated' && profileStatus === 'ready' && user) {
            const target = getPostLoginRedirect(user);
            router.replace(target);
        }
    }, [user, authStatus, profileStatus, getPostLoginRedirect, router]);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'profile') {
            setError('Erro ao carregar perfil. Tente fazer login novamente ou contacte o suporte.');
        } else if (errorParam === 'rls_profiles') {
            setError('Erro de permissão no banco de dados. Contacte o administrador.');
        }
    }, [searchParams]);

    const handleGoogle = async () => {
        try {
            setOauthStarting(true);
            await loginWithGoogle();
        } catch (err) {
            console.error('[LOGIN] Google OAuth error:', err);
            setError('Erro ao iniciar login com Google. Tente novamente.');
            setOauthStarting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const loggedInUser = await login(email, password);
            if (!loggedInUser) {
                setError('Email ou senha incorretos.');
                return;
            }
            trackEvent('login_success', { userId: loggedInUser.id });
            // Navigation is handled by the useEffect
        } catch (err: any) {
            setError(err?.message || 'Erro ao entrar.');
        } finally {
            setSubmitting(false);
        }
    };

    const authLoading = authStatus === 'booting' || authStatus === 'authenticating';

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10 sm:py-12">
            <div className="w-full min-w-0 max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-5">
                        <AppButton variant="ghost" size="sm" asChild className="-ml-2">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </AppButton>
                        <div className="flex justify-center">
                            <BrandLogo variant="auth" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
                            <CardDescription className="mt-1">
                                Use o seu email para entrar e começar a anunciar.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <form onSubmit={handleSubmit} id="login-form" className="space-y-5">
                            <AppButton
                                type="button"
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handleGoogle}
                                disabled={oauthStarting || authLoading}
                            >
                                <GoogleIcon className="h-5 w-5" />
                                {oauthStarting ? 'A abrir Google...' : 'Entrar com Google'}
                            </AppButton>

                            <div className="relative flex items-center gap-2 py-1">
                                <div className="flex-1 border-t border-border" />
                                <span className="text-xs font-medium text-muted-foreground">OU</span>
                                <div className="flex-1 border-t border-border" />
                            </div>

                            {error && (
                                <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <InputWithIcon
                                    id="login-email"
                                    type="email"
                                    placeholder="exemplo@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    leftIcon={<Mail className="h-4 w-4" />}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="login-password">Senha</Label>
                                    <Link
                                        href="/termos"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <InputWithIcon
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    rightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    onRightIconClick={() => setShowPassword((v) => !v)}
                                />
                            </div>

                            <AppButton type="submit" className="w-full" size="lg" disabled={submitting || authLoading}>
                                {submitting ? 'A entrar...' : 'Entrar'}
                            </AppButton>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 border-t pt-6">
                        <p className="text-center text-sm text-muted-foreground">
                            Ainda não tem conta?{' '}
                            <Link href="/cadastro" className="font-medium text-primary hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center bg-muted/50">A carregar...</div>}>
            <LoginForm />
        </Suspense>
    );
}
