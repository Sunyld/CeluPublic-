import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';
import { 
  Smartphone, Shirt, Car, Home, Laptop, Briefcase, Heart, Trophy, Tag, 
  ShoppingCart, Utensils, Gamepad2, Music, Camera, Zap, Droplet, Star, 
  Sparkles, Globe, TrendingUp, Award, BookOpen, Watch, Headphones, Speaker, 
  Tv, Monitor, Printer, Package, Truck, CreditCard, Gift, Users, User, 
  MapPin, Phone, Mail, PackageCheck, Cpu, Lightbulb, Lamp, Sofa, BedDouble, 
  Armchair, Table, Backpack, Handbag, Wallet, Motorbike, Tablet, ShoppingBag, 
  Store, DollarSign, Euro, Coins, Banknote, Coffee, Dumbbell, Activity, 
  Flower, Footprints, Sparkle, Book, Music2, Flame, Droplets, Palette, Scissors, 
  Cake, IceCream, Pizza, UtensilsCrossed, ShoppingBasket, Sprout, Leaf, 
  Stethoscope, Syringe, Microscope, PartyPopper, HeartPulse, BookHeart
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'smartphone': Smartphone,
  'laptop': Laptop,
  'tablet': Tablet,
  'tv': Tv,
  'headphones': Headphones,
  'speaker': Speaker,
  'camera': Camera,
  'gamepad2': Gamepad2,
  'printer': Printer,
  'monitor': Monitor,
  'cpu': Cpu,
  'watch': Watch,
  'shirt': Shirt,
  'footprints': Footprints,
  'backpack': Backpack,
  'handbag': Handbag,
  'wallet': Wallet,
  'home': Home,
  'sofa': Sofa,
  'bed': BedDouble,
  'armchair': Armchair,
  'table': Table,
  'lamp': Lamp,
  'lightbulb': Lightbulb,
  'car': Car,
  'motorcycle': Motorbike,
  'utensils': Utensils,
  'utensils-crossed': UtensilsCrossed,
  'coffee': Coffee,
  'pizza': Pizza,
  'ice-cream': IceCream,
  'cake': Cake,
  'heart': Heart,
  'heart-pulse': HeartPulse,
  'droplet': Droplet,
  'droplets': Droplets,
  'palette': Palette,
  'comb': Scissors,
  'scissors': Scissors,
  'stethoscope': Stethoscope,
  'syringe': Syringe,
  'microscope': Microscope,
  'star': Star,
  'trophy': Trophy,
  'dumbbell': Dumbbell,
  'activity': Activity,
  'trending-up': TrendingUp,
  'briefcase': Briefcase,
  'store': Store,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  'shopping-basket': ShoppingBasket,
  'package': Package,
  'package-check': PackageCheck,
  'truck': Truck,
  'credit-card': CreditCard,
  'dollar-sign': DollarSign,
  'euro': Euro,
  'coin': Coins,
  'banknote': Banknote,
  'flower': Flower,
  'leaf': Leaf,
  'sprout': Sprout,
  'sparkle': Sparkle,
  'sparkles': Sparkles,
  'flame': Flame,
  'book': Book,
  'book-open': BookOpen,
  'book-heart': BookHeart,
  'music': Music,
  'music-2': Music2,
  'party-popper': PartyPopper,
  'tag': Tag,
  'gift': Gift,
  'users': Users,
  'user': User,
  'map-pin': MapPin,
  'phone': Phone,
  'mail': Mail,
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
