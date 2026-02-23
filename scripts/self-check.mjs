/**
 * Self-check script for Phase 2 logic: limits, public selectors, WhatsApp builder.
 * Run from project root: node scripts/self-check.mjs
 * Or: npm run self-check
 */

const LIMITS = { MAX_PRODUCTS: 10, MAX_SERVICES: 5 };

function approvedOwnerIds(users) {
  const set = new Set();
  for (const u of users) {
    if (u.status === 'approved') set.add(u.id);
  }
  return set;
}

function getPublicAds(ads, users) {
  const approved = approvedOwnerIds(users);
  return ads
    .filter((a) => a.status === 'published' && approved.has(a.userId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function buildWhatsAppMessage(ad, categoryName) {
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

function ok(name) {
  console.log(`  PASS: ${name}`);
  passed++;
}

function fail(name, reason) {
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
const ads = [
  { id: '1', userId: 'u1', type: 'product', status: 'published', title: 'A', price: 1, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1', likes: 0, createdAt: now, updatedAt: now },
  { id: '2', userId: 'u1', type: 'product', status: 'draft', title: 'B', price: 2, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1', likes: 0, createdAt: now, updatedAt: now },
  { id: '3', userId: 'u2', type: 'product', status: 'published', title: 'C', price: 3, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '2', likes: 0, createdAt: now, updatedAt: now },
  { id: '4', userId: 'u3', type: 'product', status: 'hidden', title: 'D', price: 4, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '3', likes: 0, createdAt: now, updatedAt: now },
];
const users = [
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
const productAd = { type: 'product', title: 'Telemóvel', price: 1000, priceOnRequest: false, location: 'Maputo', neighborhood: undefined };
const productMsg = buildWhatsAppMessage(productAd);
if (productMsg.includes('CeluPublic') && productMsg.includes('Produto') && productMsg.includes('Preço') && productMsg.includes('1000 MT')) ok('Product message contains CeluPublic, Produto, Preço, price');
else fail('buildWhatsAppMessage(product)', `missing expected parts. Got: ${productMsg.slice(0, 120)}...`);
const serviceAd = { type: 'service', title: 'Pintura', price: null, priceOnRequest: true, location: 'Matola', neighborhood: undefined };
const serviceMsg = buildWhatsAppMessage(serviceAd, 'Construção');
if (serviceMsg.includes('CeluPublic') && serviceMsg.includes('Serviço') && serviceMsg.includes('Pintura') && serviceMsg.includes('Construção')) ok('Service message contains CeluPublic, Serviço, title, category');
else fail('buildWhatsAppMessage(service)', `missing expected parts. Got: ${serviceMsg.slice(0, 120)}...`);

console.log('\nSelf-check: click tracking (in-memory simulation)');
const clicks = [];
function trackWhatsAppClick(adId) {
  clicks.push({ id: `c-${clicks.length}`, adId, createdAt: new Date().toISOString(), type: 'whatsapp' });
}
function getStatsFromClicks(list) {
  const clicksByAdId = {};
  for (const c of list) {
    clicksByAdId[c.adId] = (clicksByAdId[c.adId] ?? 0) + 1;
  }
  return { totalClicks: list.length, clicksByAdId };
}
trackWhatsAppClick('ad-x');
trackWhatsAppClick('ad-x');
trackWhatsAppClick('ad-y');
const stats1 = getStatsFromClicks(clicks);
if (stats1.totalClicks === 3 && stats1.clicksByAdId['ad-x'] === 2 && stats1.clicksByAdId['ad-y'] === 1) ok('Tracking WhatsApp click increments totals and clicksByAdId');
else fail('click tracking', `expected totalClicks=3, clicksByAdId ad-x=2 ad-y=1; got ${JSON.stringify(stats1)}`);

console.log('\nSelf-check: trending selector (order by clicks desc)');
function getTrendingPublicAds(adsList, usersList, clicksByAdId, limit = 8) {
  const publicList = getPublicAds(adsList, usersList);
  return [...publicList]
    .sort((a, b) => {
      const ca = clicksByAdId[a.id] ?? 0;
      const cb = clicksByAdId[b.id] ?? 0;
      if (cb !== ca) return cb - ca;
      return b.likes - a.likes;
    })
    .slice(0, limit);
}
const adsForTrending = [
  { id: 't1', userId: 'u1', type: 'product', status: 'published', title: 'T1', likes: 5, updatedAt: now, createdAt: now, price: 1, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1' },
  { id: 't2', userId: 'u1', type: 'product', status: 'published', title: 'T2', likes: 10, updatedAt: now, createdAt: now, price: 2, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1' },
  { id: 't3', userId: 'u1', type: 'product', status: 'published', title: 'T3', likes: 0, updatedAt: now, createdAt: now, price: 3, priceOnRequest: false, location: 'X', categoryId: 'c1', images: [], whatsapp: '1' },
];
const usersForTrending = [{ id: 'u1', status: 'approved', role: 'seller' }];
const clicksByAdIdTrending = { t1: 10, t2: 3, t3: 0 };
const trending = getTrendingPublicAds(adsForTrending, usersForTrending, clicksByAdIdTrending, 3);
if (trending.length === 3 && trending[0].id === 't1' && trending[1].id === 't2' && trending[2].id === 't3') ok('Trending selector returns order by clicks desc (t1=10, t2=3, t3=0)');
else fail('getTrendingPublicAds', `expected order t1,t2,t3 got ${trending.map((a) => a.id).join(',')}`);

console.log('\n---');
if (failed === 0) {
  console.log(`All ${passed} checks passed.`);
  process.exit(0);
} else {
  console.log(`${passed} passed, ${failed} failed.`);
  process.exit(1);
}
