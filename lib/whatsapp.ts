import type { Ad } from '@/types';

/**
 * Builds a rich prefilled message for WhatsApp contact (product or service).
 * Portuguese copy for Mozambique.
 */
export function buildWhatsAppMessage(ad: Ad, categoryName?: string): string {
  const local = [ad.location, ad.neighborhood].filter(Boolean).join(', ');

  if (ad.type === 'product') {
    const priceFormatted =
      ad.priceOnRequest || ad.price == null ? 'sob consulta' : `${ad.price} MT`;
    const lines = [
      'Olá! Vi este produto no CeluPublic:',
      `• Produto: ${ad.title}`,
      `• Preço: ${priceFormatted}`,
      `• Local: ${local || '—'}`,
      '',
      'Ainda está disponível? Podemos combinar a entrega/levantamento?',
    ];
    return lines.join('\n');
  }

  const serviceLines = [
    'Olá! Vi este serviço no CeluPublic:',
    `• Serviço: ${ad.title}`,
    ...(categoryName ? [`• Categoria: ${categoryName}`] : []),
    `• Local: ${local || '—'}`,
    '',
    'Pode atender? Qual seria o valor aproximado e disponibilidade?',
  ];
  return serviceLines.join('\n');
}

/**
 * Sanitizes phone for wa.me (digits only; leading + is stripped).
 */
function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Builds full WhatsApp URL with prefilled message (URL-encoded).
 */
export function buildWhatsAppHref(whatsapp: string, message: string): string {
  const number = sanitizePhone(whatsapp);
  if (!number) return '#';
  const base = `https://wa.me/${number}`;
  if (!message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * One-shot: build message and href for an ad (uses seller WhatsApp from ad).
 */
export function buildWhatsAppUrl(ad: Ad, categoryName?: string): string {
  const message = buildWhatsAppMessage(ad, categoryName);
  return buildWhatsAppHref(ad.whatsapp, message);
}
