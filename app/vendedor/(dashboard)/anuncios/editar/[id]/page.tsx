'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdForm } from '@/components/vendedor/AdForm';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Ad } from '@/types';
import { Loader2 } from 'lucide-react';

function EditAdContent() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [ad, setAd] = useState<Ad | null | undefined>(undefined);

    const id = typeof params?.id === 'string' ? params.id : null;

    useEffect(() => {
        if (!id || !user) {
            if (!user) router.replace('/entrar');
            return;
        }
        const load = async () => {
            try {
                const r = await fetch(`/api/vendedor/anuncios/${id}`, { cache: 'no-store' });
                if (!r.ok) {
                    if (r.status === 404) setAd(null);
                    else router.replace('/vendedor');
                    return;
                }
                const data = await r.json();
                if (data.userId !== user.id && user.role !== 'admin') {
                    router.replace('/vendedor');
                    return;
                }
                setAd(data);
            } catch {
                setAd(null);
            }
        };
        void load();
    }, [id, user, router]);

    if (ad === undefined) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    if (ad === null) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                Anúncio não encontrado.
            </div>
        );
    }

    return (
        <div className="py-6">
            <AdForm initialAd={ad} />
        </div>
    );
}

export default function EditAdPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <EditAdContent />
        </Suspense>
    );
}
