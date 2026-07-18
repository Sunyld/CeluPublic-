import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';
import { 
  Smartphone, Shirt, Car, Home, Laptop, Briefcase, Heart, Trophy, Tag, 
  ShoppingCart, Utensils, Gamepad2, Music, Camera, Zap, Droplet, Star, 
  Sparkles, Globe, TrendingUp, Award, Bookmark, Book, Activity, AlertCircle, 
  Anchor, Building2, Archive, ArrowDownCircle, ArrowUpCircle, ArrowLeftCircle, 
  ArrowRightCircle, AtSign, Axe, BadgeCheck, BadgeDollarSign, BadgeHelp, 
  BadgeInfo, BadgePercent, BadgePlus, BadgeX, Banknote, Banana, Battery, 
  Bed, Bell, Bike, Bird, Bluetooth, Ship
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'smartphone': Smartphone,
  'shirt': Shirt,
  'car': Car,
  'home': Home,
  'laptop': Laptop,
  'briefcase': Briefcase,
  'heart': Heart,
  'trophy': Trophy,
  'tag': Tag,
  'shopping-cart': ShoppingCart,
  'utensils': Utensils,
  'gamepad2': Gamepad2,
  'music': Music,
  'camera': Camera,
  'zap': Zap,
  'droplet': Droplet,
  'star': Star,
  'sparkles': Sparkles,
  'globe': Globe,
  'trending-up': TrendingUp,
  'award': Award,
  'bookmark': Bookmark,
  'book': Book,
  'activity': Activity,
  'alert-circle': AlertCircle,
  'anchor': Anchor,
  'building2': Building2,
  'archive': Archive,
  'arrow-down-circle': ArrowDownCircle,
  'arrow-up-circle': ArrowUpCircle,
  'arrow-left-circle': ArrowLeftCircle,
  'arrow-right-circle': ArrowRightCircle,
  'at-sign': AtSign,
  'axe': Axe,
  'badge-check': BadgeCheck,
  'badge-dollar-sign': BadgeDollarSign,
  'badge-help': BadgeHelp,
  'badge-info': BadgeInfo,
  'badge-percent': BadgePercent,
  'badge-plus': BadgePlus,
  'badge-x': BadgeX,
  'banknote': Banknote,
  'banana': Banana,
  'battery': Battery,
  'bed': Bed,
  'bell': Bell,
  'bike': Bike,
  'bird': Bird,
  'bluetooth': Bluetooth,
  'ship': Ship,
};

export interface CategoryPillItem {
  id: string;
  label: string;
  icon?: string;
}

interface CategoryPillsProps {
  items: CategoryPillItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Pills estilo UGMONK: ícone + texto. Ativo = negrito + sublinhado. Inativo = cinza.
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
        const Icon = item.icon ? iconMap[item.icon] : null;
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
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </div>
          </AppButton>
        );
      })}
    </div>
  );
}
