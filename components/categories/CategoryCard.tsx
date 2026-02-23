import Link from 'next/link';
import type { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Smartphone,
  Shirt,
  Home,
  Wrench,
  Car,
  UtensilsCrossed,
  FolderOpen,
} from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  eletronica: Smartphone,
  vestuario: Shirt,
  'servicos-domesticos': Home,
  'construcao-reparacao': Wrench,
  automoveis: Car,
  alimentacao: UtensilsCrossed,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = categoryIcons[category.slug] ?? FolderOpen;

  return (
    <Link href={`/anuncios?categoria=${category.id}`}>
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">{category.name}</h3>
          {category.adCount != null && (
            <p className="mt-1 text-sm text-muted-foreground">{category.adCount} anúncios</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
