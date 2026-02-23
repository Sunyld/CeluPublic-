'use client';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/context/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <AuthProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </AuthProvider>
        </AppProvider>
    );
}
