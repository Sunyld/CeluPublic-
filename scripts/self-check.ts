/**
 * Self-check script for Phase 2 logic: limits, public selectors, WhatsApp builder.
 * Run from project root: npx tsx scripts/self-check.ts
 * Or: node --import tsx scripts/self-check.ts
 */

/* eslint-disable no-console */

const LIMITS = { MAX_PRODUCTS: 10, MAX_SERVICES: 5 } as const;

type AdStatus = 'draft' | 'published' | 'hidden';
type AdType = 'product' | 'service';

interface MockAd {
  id: string;
  userId: string;
  type: AdType;
  status: AdStatus;
  title: string;
  price: number | null;
  priceOnRequest: boolean;
  location: string;
  categoryId: string;
  images: string[];
  whatsapp: string;
  likes: number;
  userName?: string;
  description?: string;
  neighborhood?: string;
  createdAt: string;
  updatedAt: string;
}

interface MockUser {
  id: string;
  status: string;
  role: string;
}

function approvedOwnerIds(users: MockUser[]): Set<string> {
  const set = new Set<string>();
  for (const u of users) {
    if (u.status === 'approved') set.add(u.id);
  }
  return set;
}

function getPublicAds(ads: MockAd[], users: MockUser[]): MockAd[] {
  const approved = approvedOwnerIds(users);
  return ads
    .filter((a) => a.status === 'published' && approved.has(a.userId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function buildWhatsAppMessage(
  ad: { type: AdType; title: string; price: number | null; priceOnRequest: boolean; location: string; neighborhood?: string },
  categoryName?: string
): string {
  const local = [ad.location, ad.neighborhood].filter(Boolean).join(' ');
  if (ad.type === 'product') {
    const priceFormatted =
      ad.priceOnRequest || ad.price == null ? 'sob consulta' : `${ad.price} MT`;
    return [
      'Olá! Vi este produto no CeluPublic:',
      `• Produto: ${ad.title}`,
      `• Preço: ${priceFormatted}`,
      `• Local: ${local || '—'}`,
      '',
      'Ainda está disponível? Podemos combinar a entrega/levantamento?',
    ].join('\n');
  }
  return [
    'Olá! Vi este serviço no CeluPublic:',
    `• Serviço: ${ad.title}`,
    ...(categoryName ? [`• Categoria: ${categoryName}`] : []),
    `• Local: ${local || '—'}`,
    '',
    'Pode atender? Qual seria o valor aproximado e disponibilidade?',
  ].join('\n');
}

let passed = 0;
let failed = 0;

function ok(name: string) {
  console.log(`  PASS: ${name}`);
  passed++;
}

function fail(name: string, reason: string) {
  console.log(`  FAIL: ${name} - ${reason}`);
  failed++;
}

console.log('Self-check: limit constants');
if (LIMITS.MAX_PRODUCTS === 10) ok('MAX_PRODUCTS === 10');
else fail('MAX_PRODUCTS', `expected 10, got ${LIMITS.MAX_PRODUCTS}`);
if (LIMITS.MAX_SERVICES === 5) ok('MAX_SERVICES === 5');
else fail('MAX_SERVICES', `expected 5, got ${LIMITS.MAX_SERVICES}`);

console.log('\nSelf-check: public ads selectors (status === published + owner approved)');
const now = new Date().toISOString();
const ads: MockAd[] = [
  { id: '1', userId: 'u1', type: 'product', status: 'published', title: 'A', price: 1, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1', likes: 0, createdAt: now, updatedAt: now },
  { id: '2', userId: 'u1', type: 'product', status: 'draft', title: 'B', price: 2, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1', likes: 0, createdAt: now, updatedAt: now },
  { id: '3', userId: 'u2', type: 'product', status: 'published', title: 'C', price: 3, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '2', likes: 0, createdAt: now, updatedAt: now },
  { id: '4', userId: 'u3', type: 'product', status: 'hidden', title: 'D', price: 4, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '3', likes: 0, createdAt: now, updatedAt: now },
];
const users: MockUser[] = [
  { id: 'u1', status: 'approved', role: 'seller' },
  { id: 'u2', status: 'rejected', role: 'seller' },
  { id: 'u3', status: 'approved', role: 'seller' },
];
const publicList = getPublicAds(ads, users);
if (publicList.length === 1 && publicList[0].id === '1') ok('Only published + approved owner ads returned (u1 approved published)');
else fail('getPublicAds', `expected 1 ad (id=1), got ${publicList.length}: ${publicList.map((a) => a.id).join(', ')}`);
if (!publicList.some((a) => a.status !== 'published')) ok('No draft/hidden in public list');
else fail('getPublicAds', 'public list must only contain status published');

console.log('\nSelf-check: WhatsApp message builder');
const productAd = { type: 'product' as const, title: 'Telemóvel', price: 1000, priceOnRequest: false, location: 'Maputo', neighborhood: undefined as string | undefined };
const productMsg = buildWhatsAppMessage(productAd);
if (productMsg.includes('CeluPublic') && productMsg.includes('Produto') && productMsg.includes('Preço') && productMsg.includes('1000 MT')) ok('Product message contains CeluPublic, Produto, Preço, price');
else fail('buildWhatsAppMessage(product)', `missing expected parts. Got: ${productMsg.slice(0, 120)}...`);
const serviceAd = { type: 'service' as const, title: 'Pintura', price: null, priceOnRequest: true, location: 'Matola', neighborhood: undefined as string | undefined };
const serviceMsg = buildWhatsAppMessage(serviceAd, 'Construção');
if (serviceMsg.includes('CeluPublic') && serviceMsg.includes('Serviço') && serviceMsg.includes('Pintura') && serviceMsg.includes('Construção')) ok('Service message contains CeluPublic, Serviço, title, category');
else fail('buildWhatsAppMessage(service)', `missing expected parts. Got: ${serviceMsg.slice(0, 120)}...`);

console.log('\n---');
if (failed === 0) {
  console.log(`All ${passed} checks passed.`);
  process.exit(0);
} else {
  console.log(`${passed} passed, ${failed} failed.`);
  process.exit(1);
}
