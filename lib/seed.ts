/**
 * Dados iniciais para o MVP: admin, vendedor demo, categorias, banners e cards de produtos.
 * Com VITE_USE_SUPABASE=true não seedamos users (ficam em Supabase).
 */

import type { User, Category, Banner, Ad } from '../types';
import { storage } from './storage';
import { useSupabase } from './supabaseClient';

const ADMIN_EMAIL = 'admin@celupublic.com';
const ADMIN_PASS = 'admin123';
const DEMO_SELLER_ID = 'seller-demo-1';

export function seedIfEmpty() {
  const users = storage.getUsers();
  const categories = storage.getCategories();
  const banners = storage.getBanners();
  const ads = storage.getAds();

  if (users.length === 0 && !useSupabase) {
    const now = new Date().toISOString();
    const admin: User = {
      id: 'admin-1',
      email: ADMIN_EMAIL,
      name: 'Administrador',
      role: 'admin',
      status: 'approved',
      whatsapp: '258840000000',
      city: 'Maputo',
      province: 'Maputo Cidade',
      createdAt: now,
      updatedAt: now,
    };
    const demoSeller: User = {
      id: DEMO_SELLER_ID,
      email: 'vendedor@celupublic.com',
      name: 'Loja Demo',
      role: 'seller',
      status: 'approved',
      accountType: 'both',
      whatsapp: '258840000001',
      city: 'Maputo',
      province: 'Maputo Cidade',
      createdAt: now,
      updatedAt: now,
    };
    storage.setUsers([admin, demoSeller]);
    const passMap: Record<string, string> = {};
    passMap[admin.id] = ADMIN_PASS;
    passMap[demoSeller.id] = 'demo123';
    try {
      localStorage.setItem('celupublic_user_pass', JSON.stringify(passMap));
    } catch {
      // ignore
    }
  }

  if (categories.length === 0 && !useSupabase) {
    const cats: Category[] = [
      { id: 'cat-1', name: 'Eletrónica', slug: 'eletronica' },
      { id: 'cat-2', name: 'Vestuário', slug: 'vestuario' },
      { id: 'cat-3', name: 'Serviços Domésticos', slug: 'servicos-domesticos' },
      { id: 'cat-4', name: 'Construção e Reparação', slug: 'construcao-reparacao' },
      { id: 'cat-5', name: 'Automóveis', slug: 'automoveis' },
      { id: 'cat-6', name: 'Alimentação', slug: 'alimentacao' },
    ];
    storage.setCategories(cats);
  }

  if (banners.length === 0 && !useSupabase) {
    const defaultBanners: Banner[] = [
      {
        id: 'banner-1',
        imageUrl: 'https://placehold.co/1200x400/0d9488/ffffff?text=CeluPublic+-+Conecte+via+WhatsApp',
        title: 'Conecte vendedores e clientes via WhatsApp',
        active: true,
        order: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    storage.setBanners(defaultBanners);
  }

  if (ads.length === 0 && !useSupabase) {
    const now = new Date().toISOString();
    const sampleAds: Ad[] = [
      {
        id: 'ad-1',
        title: 'Smartphone Samsung Galaxy A54',
        description: 'Smartphone em excelente estado, 128GB, dual SIM. Inclui carregador e capa.',
        price: 18500,
        priceOnRequest: false,
        location: 'Maputo',
        categoryId: 'cat-1',
        images: ['https://placehold.co/600x400/1e293b/94a3b8?text=Smartphone'],
        whatsapp: '258840000001',
        type: 'product',
        likes: 12,
        userId: DEMO_SELLER_ID,
        userName: 'Loja Demo',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ad-2',
        title: 'Notebook HP 15',
        description: 'Notebook para trabalho e estudos. 8GB RAM, 256GB SSD, Windows 11.',
        price: 32000,
        priceOnRequest: false,
        location: 'Matola',
        categoryId: 'cat-1',
        images: ['https://placehold.co/600x400/1e293b/94a3b8?text=Notebook'],
        whatsapp: '258840000001',
        type: 'product',
        likes: 8,
        userId: DEMO_SELLER_ID,
        userName: 'Loja Demo',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ad-3',
        title: 'Pintura Residencial e Comercial',
        description: 'Serviço de pintura interior e exterior. Orçamento gratuito. Materiais incluídos ou à parte.',
        price: null,
        priceOnRequest: true,
        location: 'Maputo',
        categoryId: 'cat-4',
        images: ['https://placehold.co/600x400/0d9488/ffffff?text=Pintura'],
        whatsapp: '258840000002',
        type: 'service',
        likes: 15,
        userId: DEMO_SELLER_ID,
        userName: 'Loja Demo',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ad-4',
        title: 'Reparação de Eletrodomésticos',
        description: 'Reparo de frigoríficos, máquinas de lavar e ar condicionado. Garantia no serviço.',
        price: null,
        priceOnRequest: true,
        location: 'Maputo',
        categoryId: 'cat-3',
        images: ['https://placehold.co/600x400/1e293b/94a3b8?text=Reparacao'],
        whatsapp: '258840000003',
        type: 'service',
        likes: 22,
        userId: DEMO_SELLER_ID,
        userName: 'Loja Demo',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ad-5',
        title: 'T-shirt Básica Algodão',
        description: 'T-shirt 100% algodão, várias cores. Tamanhos M a XXL. Lote para revenda.',
        price: 450,
        priceOnRequest: false,
        location: 'Maputo',
        categoryId: 'cat-2',
        images: ['https://placehold.co/600x400/f1f5f9/64748b?text=Camiseta'],
        whatsapp: '258840000001',
        type: 'product',
        likes: 5,
        userId: DEMO_SELLER_ID,
        userName: 'Loja Demo',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ad-6',
        title: 'Pizza Caseira Delivery',
        description: 'Pizza artesanal entregue em casa. Massa fina, ingredientes frescos. Peça por WhatsApp.',
        price: 350,
        priceOnRequest: false,
        location: 'Matola',
        categoryId: 'cat-6',
        images: ['https://placehold.co/600x400/fef3c7/d97706?text=Pizza'],
        whatsapp: '258840000004',
        type: 'product',
        likes: 18,
        userId: DEMO_SELLER_ID,
        userName: 'Loja Demo',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
    ];
    storage.setAds(sampleAds);
  }
}
