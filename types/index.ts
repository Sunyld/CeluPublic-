/**
 * Tipos centrais do CeluPublic.
 * Ads unificam produtos e serviços numa única entidade.
 */

export type AdType = 'product' | 'service';

export type AdStatus = 'draft' | 'published' | 'hidden';

export type UserRole = 'admin' | 'seller' | 'client';

export type AccountStatus = 'pending' | 'pending_payment' | 'pending_review' | 'approved' | 'rejected' | 'blocked' | 'suspended';

export type AccountType = 'seller' | 'provider' | 'both';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  adCount?: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number | null; // null = "Sob consulta"
  priceOnRequest: boolean;
  location: string;    // city (from select)
  province?: string;   // for Supabase DB (form has it)
  neighborhood?: string; // bairro (optional)
  categoryId: string;
  images: string[];
  whatsapp: string;
  type: AdType;
  likes: number;
  userId: string;
  userName?: string;
  /** Lifecycle: draft (not public), published (public), hidden (not public). */
  status: AdStatus;
  createdAt: string;
  updatedAt: string;
}


export interface User {
  id: string;
  email: string;
  name: string; // nome completo (full_name)
  role: UserRole;
  status: AccountStatus;
  accountType?: AccountType; // seller | provider | both (vendedores/prestadores)
  whatsapp?: string;
  city?: string;
  province?: string;
  createdAt: string;
  updatedAt?: string;
  adminNote?: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

/** IDs de likes por dispositivo (session) - armazenados em localStorage */
export interface LikedAdIds {
  [adId: string]: boolean;
}

/** Click event for conversion tracking (e.g. WhatsApp CTA). Stored locally; later ad_clicks in Supabase. */
export type AdClickType = 'whatsapp';

export interface AdClick {
  id: string;
  adId: string;
  createdAt: string; // ISO
  type: AdClickType;
}

export interface ClickStats {
  totalClicks: number;
  clicksByAdId: Record<string, number>;
  /** Top ads by clicks (desc), shape { adId, clicks } */
  topAds: { adId: string; clicks: number }[];
}
