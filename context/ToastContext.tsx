import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent } from '@/components/ui/card';

type ToastVariant = 'success' | 'error' | 'info';

export type ToastOptions = {
  id?: string;
  title?: string;
  description: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastState = ToastOptions & { id: string };

type ToastContextValue = {
  showToast: (toast: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((toast: ToastOptions) => {
    const id = toast.id ?? crypto.randomUUID();
    const next: ToastState = {
      ...toast,
      id,
      variant: toast.variant ?? 'info',
    };
    setToasts((prev) => [...prev, next]);
    // Auto-dismiss após 5s.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container simples no canto inferior direito */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-4">
        <div className="flex w-full max-w-sm flex-col gap-2">
          {toasts.map((toast) => (
            <Card
              key={toast.id}
              className="pointer-events-auto border shadow-lg"
              data-variant={toast.variant}
            >
              <CardContent className="flex flex-col gap-2 py-3">
                {toast.title ? (
                  <p className="text-sm font-medium">
                    {toast.title}
                  </p>
                ) : null}
                <p className="text-sm text-muted-foreground">{toast.description}</p>
                {toast.actionLabel && toast.onAction ? (
                  <div className="mt-1">
                    <AppButton
                      size="sm"
                      variant={toast.variant === 'error' ? 'destructive' : 'outline'}
                      onClick={toast.onAction}
                    >
                      {toast.actionLabel}
                    </AppButton>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/** Safe hook: returns null if outside ToastProvider. Use when component may render without provider. */
export function useToastOptional() {
  const ctx = useContext(ToastContext);
  return ctx;
}

