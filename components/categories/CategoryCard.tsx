import Link from 'next/link';
import type { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
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
  Stethoscope, Syringe, Microscope, PartyPopper, HeartPulse, BookHeart,
  Tag as DefaultIcon
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

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon ? (iconMap[category.icon] ?? DefaultIcon) : DefaultIcon;

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
