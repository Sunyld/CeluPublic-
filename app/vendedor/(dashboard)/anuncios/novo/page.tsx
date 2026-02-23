'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdForm } from '@/components/vendedor/AdForm';
import type { AdType } from '@/types';

function NewAdContent() {
    const searchParams = useSearchParams();
    const tipo = (searchParams.get('tipo') as AdType) || 'product';

    return <AdForm defaultType={tipo} />;
}

export default function NewAdPage() {
    return (
        <div className="py-6">
            <Suspense fallback={<div className="flex justify-center py-12">Carregando formulário...</div>}>
                <NewAdContent />
            </Suspense>
        </div>
    );
}
