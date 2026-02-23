'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AppButton } from '@/components/ui/app-button';

const STORAGE_KEY = 'celu_welcome_seen';
const CREDIT_URL = 'https://sunylddev.vercel.app/';

export function WelcomePopup() {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const seen = localStorage.getItem(STORAGE_KEY);
        if (seen !== '1') {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, '1');
        }
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen) handleClose();
            }}
        >
            <DialogContent
                className="sm:max-w-[480px]"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    setTimeout(() => buttonRef.current?.focus(), 0);
                }}
            >
                <DialogHeader>
                    <DialogTitle>Bem-vindo à Celu_public</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                            <p>
                                A loja que ajuda você a comprar e encontrar produtos e serviços de
                                forma fácil, segura e eficaz. Volte sempre. SHALOM!
                            </p>
                            <p className="text-xs">
                                Site criado por{' '}
                                <a
                                    href={CREDIT_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                                >
                                    Sunyld Matapa
                                </a>
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2 pt-2">
                    <AppButton ref={buttonRef} onClick={handleClose}>
                        Entrar na loja
                    </AppButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
