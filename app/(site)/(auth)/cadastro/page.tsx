'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import type { AccountType } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/ui/google-icon';
import { BrandLogo } from '@/components/BrandLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PROVINCIAS_MOCAMBIQUE } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
    { value: 'seller', label: 'Vendedor' },
    { value: 'provider', label: 'Prestador de serviços' },
    { value: 'both', label: 'Vendedor e prestador' },
];

export default function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<AccountType>('seller');
    const [whatsapp, setWhatsapp] = useState('');
    const [province, setProvince] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register, loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (!province) {
            setError('Selecione a província.');
            return;
        }
        setSubmitting(true);
        try {
            const user = await register({
                full_name: fullName,
                email,
                password,
                account_type: accountType,
                whatsapp,
                province,
            });
            if (!user) {
                setError('Este email já está cadastrado ou ocorreu um erro.');
                return;
            }
            trackEvent('signup_success', { userId: user.id, email: user.email });
            router.push('/ativacao');
        } catch (err: any) {
            setError(err?.message || 'Erro ao criar conta.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10 sm:py-12">
            <div className="w-full min-w-0 max-w-lg">
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
                            <CardTitle className="text-xl">Criar conta</CardTitle>
                            <CardDescription className="mt-1">
                                Registe-se como vendedor ou prestador de serviços para publicar anúncios.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <form onSubmit={handleSubmit} id="signup-form" className="space-y-5">
                            <AppButton
                                type="button"
                                variant="outline"
                                className="w-full gap-2"
                                onClick={loginWithGoogle}
                                disabled={submitting}
                            >
                                <GoogleIcon className="h-5 w-5" />
                                Cadastrar com Google
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
                                <Label htmlFor="signup-name">Nome completo</Label>
                                <InputWithIcon
                                    id="signup-name"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    leftIcon={<User className="h-4 w-4" />}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <InputWithIcon
                                    id="signup-email"
                                    type="email"
                                    placeholder="exemplo@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    leftIcon={<Mail className="h-4 w-4" />}
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Senha (mín. 6 caracteres)</Label>
                                    <InputWithIcon
                                        id="signup-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        leftIcon={<Lock className="h-4 w-4" />}
                                        rightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        onRightIconClick={() => setShowPassword((v) => !v)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm">Confirmar senha</Label>
                                    <InputWithIcon
                                        id="signup-confirm"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        leftIcon={<Lock className="h-4 w-4" />}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de conta</Label>
                                <div className="flex flex-wrap gap-4 rounded-lg border border-input bg-background px-3 py-2">
                                    {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                                        <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="account_type"
                                                value={opt.value}
                                                checked={accountType === opt.value}
                                                onChange={() => setAccountType(opt.value)}
                                                className="h-4 w-4 accent-primary"
                                            />
                                            <span className="text-sm">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-whatsapp">WhatsApp</Label>
                                <InputWithIcon
                                    id="signup-whatsapp"
                                    type="tel"
                                    placeholder="84 000 0000"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    required
                                    leftIcon={<Phone className="h-4 w-4" />}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-province">Província *</Label>
                                <select
                                    id="signup-province"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Selecione a província</option>
                                    {PROVINCIAS_MOCAMBIQUE.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <AppButton type="submit" className="w-full" size="lg" disabled={submitting}>
                                {submitting ? 'A criar conta...' : 'Criar conta'}
                            </AppButton>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 border-t pt-6">
                        <p className="text-center text-sm text-muted-foreground">
                            Já tem conta?{' '}
                            <Link href="/entrar" className="font-medium text-primary hover:underline">
                                Entrar
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
