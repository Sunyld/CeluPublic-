'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

/** Mensagem amigável para erros OAuth (incl. server_error do Supabase/Google). */
function getOAuthErrorMessage(error: string, description: string): string {
    const desc = description.trim();
    if (desc && !desc.toLowerCase().includes('database error saving new user')) return desc;
    if (desc && desc.toLowerCase().includes('database error saving new user')) {
        return 'Erro ao guardar o novo utilizador na base de dados. Aplique a migration 20260221_fix_handle_new_user_status.sql no Supabase (SQL Editor ou CLI) e tente novamente.';
    }

    switch (error) {
        case 'server_error':
            return 'O servidor de autenticação falhou. Verifique no Supabase: Redirect URLs em Authentication → URL Configuration e que a migration 20260221_fix_handle_new_user_status.sql está aplicada.';
        case 'access_denied':
            return 'Acesso negado. Cancelou o login com o Google.';
        case 'invalid_request':
            return 'Pedido de login inválido. Tente novamente.';
        case 'unauthorized_client':
            return 'Aplicação não autorizada. Confirme as configurações do Google OAuth no Supabase.';
        default:
            return `Erro de autenticação: ${error}. Tente novamente.`;
    }
}

/**
 * OAuth callback page.
 * 
 * IMPORTANTE: Não fazemos exchangeCodeForSession manualmente aqui.
 * O middleware (lib/supabase/middleware.ts) já processa o código OAuth (?code=)
 * via getClaims() e cria a sessão em cookies.
 * 
 * Este componente apenas:
 * 1. Verifica erros OAuth na URL (?error=)
 * 2. Espera pela sessão (que o middleware já criou)
 * 3. Redireciona para /pos-login quando a sessão está pronta
 */
export default function AuthCallback() {
    const router = useRouter();
    const ranRef = useRef(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;

        const supabase = createClient();
        if (!supabase) {
            setError('Supabase não configurado. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.');
            return;
        }

        const handleCallback = async () => {
            try {
                console.log('[AUTH_CALLBACK] Starting OAuth callback processing...');
                
                // 1. Check for OAuth errors in URL
                const urlParams = new URLSearchParams(window.location.search);
                const errorParam = urlParams.get('error');
                const errorDescription = urlParams.get('error_description') ?? '';

                if (errorParam) {
                    console.error('[AUTH_CALLBACK] OAuth error in URL:', errorParam, errorDescription || '');
                    // Check if session exists despite error (might be transient error)
                    const { data: { session: errorSession } } = await supabase.auth.getSession();
                    if (errorSession?.user) {
                        console.log('[AUTH_CALLBACK] Session exists despite error param, redirecting...');
                        if (typeof window !== 'undefined') {
                            const url = new URL(window.location.href);
                            url.search = '';
                            url.hash = '';
                            window.history.replaceState({}, '', url.toString());
                        }
                        router.replace('/pos-login');
                        return;
                    }
                    const friendlyMessage = getOAuthErrorMessage(errorParam, errorDescription);
                    setError(friendlyMessage);
                    return;
                }

                // 2. Middleware already processed ?code= and created session in cookies.
                // Give middleware time to process the OAuth code exchange
                console.log('[AUTH_CALLBACK] Waiting for middleware to process OAuth code...');
                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for middleware
                
                // Now check for session
                console.log('[AUTH_CALLBACK] Checking for session...');
                let session = null;
                let attempts = 0;
                const maxAttempts = 15; // Give more time for middleware to process
                
                while (!session && attempts < maxAttempts) {
                    const { data, error: sessionError } = await supabase.auth.getSession();
                    
                    if (sessionError) {
                        console.error('[AUTH_CALLBACK] Error getting session:', sessionError);
                        // Don't fail immediately - might be transient
                    }
                    
                    if (data?.session) {
                        session = data.session;
                        console.log('[AUTH_CALLBACK] Session found:', {
                            userId: session.user.id.slice(0, 8),
                            email: session.user.email
                        });
                        break;
                    }
                    
                    attempts++;
                    if (attempts < maxAttempts) {
                        console.log(`[AUTH_CALLBACK] Waiting for session... attempt ${attempts}/${maxAttempts}`);
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }

                if (!session) {
                    // Fallback: wait for onAuthStateChange (in case session arrives later)
                    console.log('[AUTH_CALLBACK] No session yet, waiting for onAuthStateChange...');
                    let resolved = false;
                    
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
                        if (resolved) return;
                        console.log('[AUTH_CALLBACK] Auth state changed:', event, newSession?.user?.id?.slice(0, 8));
                        
                        if (newSession?.user) {
                            resolved = true;
                            subscription.unsubscribe();
                            
                            // Clean URL
                            if (typeof window !== 'undefined') {
                                const cleanUrl = new URL(window.location.href);
                                cleanUrl.search = '';
                                cleanUrl.hash = '';
                                window.history.replaceState({}, '', cleanUrl.toString());
                            }
                            
                            console.log('[AUTH_CALLBACK] Redirecting to /pos-login');
                            router.replace('/pos-login');
                        }
                    });
                    
                    // Timeout after 20 seconds
                    setTimeout(() => {
                        if (!resolved) {
                            subscription.unsubscribe();
                            console.error('[AUTH_CALLBACK] Timeout waiting for session');
                            setError('Timeout ao processar login. O middleware pode não ter processado o código OAuth. Tente novamente.');
                        }
                    }, 20000);
                    
                    return;
                }

                // 3. Session found - clean URL and redirect
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.search = '';
                    url.hash = '';
                    window.history.replaceState({}, '', url.toString());
                }

                console.log('[AUTH_CALLBACK] Redirecting to /pos-login');
                router.replace('/pos-login');
            } catch (err: any) {
                console.error('[AUTH_CALLBACK] Unexpected error:', err);
                setError(err.message || 'Erro ao processar login');
            }
        };

        handleCallback();
    }, [router]);

    if (error) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <p className="text-sm text-destructive mb-4">{error}</p>
                    <button
                        onClick={() => router.replace('/entrar')}
                        className="text-sm text-primary hover:underline"
                    >
                        Voltar para login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">A processar login...</p>
            </div>
        </div>
    );
}
