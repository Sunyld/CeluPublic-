'use client';

import { useApp } from '@/context/AppContext';
import { getPublicAds } from '@/lib/selectors/adsSelectors';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { Card, CardContent } from '@/components/ui/card';
import { Grid3X3 } from 'lucide-react';

export default function CategoriesPage() {
    const { categories, ads, users } = useApp();
    const publicAds = getPublicAds(ads, users);

    const withCount = categories.map((c) => ({
        ...c,
        adCount: publicAds.filter((a) => a.categoryId === c.id).length,
    }));

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-2">
                <Grid3X3 className="h-6 w-6 text-primary shrink-0" />
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Categorias</h1>
            </div>
            <p className="text-muted-foreground">Escolha uma categoria para ver anúncios disponíveis.</p>

            {withCount.length === 0 ? (
                <Card className="mt-8 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Nenhuma categoria encontrada no momento.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {withCount.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </div>
            )}
        </div>
    );
}
