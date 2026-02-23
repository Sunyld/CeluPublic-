import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';

export interface CategoryPillItem {
  id: string;
  label: string;
}

interface CategoryPillsProps {
  items: CategoryPillItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Pills estilo UGMONK: só texto. Ativo = negrito + sublinhado. Inativo = cinza.
 */
export function CategoryPills({ items, activeId, onChange, className }: CategoryPillsProps) {
  return (
    <div
      className={cn(
        'flex gap-6 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible',
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted',
        className
      )}
      role="tablist"
      aria-label="Filtrar por categoria"
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <AppButton
            key={item.id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(item.id)}
            className={cn(
              'shrink-0 rounded-none border-0 border-b-2 bg-transparent px-0 pb-1 pt-0 shadow-none hover:bg-transparent',
              isActive
                ? 'border-foreground font-bold text-foreground'
                : 'border-transparent font-normal text-muted-foreground hover:text-foreground'
            )}
            role="tab"
            aria-selected={isActive}
          >
            {item.label}
          </AppButton>
        );
      })}
    </div>
  );
}
