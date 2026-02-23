'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary: catches render errors and shows a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Error caught:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      const isNetworkError =
        this.state.error &&
        /NetworkError|Failed to fetch|offline/i.test(this.state.error.message ?? '');

      return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle>Ocorreu um erro inesperado</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Algo correu mal ao carregar esta página. Pode tentar recarregar ou voltar ao início.
              </p>
              {isNetworkError && (
                <p className="text-xs text-muted-foreground">
                  Parece haver um problema de ligação à internet. Verifique a sua ligação e tente novamente.
                </p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row pt-2">
                <AppButton
                  variant="default"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Recarregar página
                </AppButton>
                <AppButton variant="outline" asChild className="flex-1">
                  <Link href="/">Ir para o Início</Link>
                </AppButton>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
