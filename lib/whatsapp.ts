import type { Ad } from '@/types';

/**
 * Normalizes a phone number to Mozambique E.164 format (12 digits, starts with 258).
 */
export function normalizeMozambiquePhone(phone: string): string | null {
  // Remove spaces, hyphens, parentheses, plus sign
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  cleaned = cleaned.replace(/\D/g, ''); // Remove any remaining non-digit characters
  
  if (!cleaned) return null;
  
  // Handle cases
  if (cleaned.length === 9) {
    // 9 digits: add 258 prefix
    cleaned = '258' + cleaned;
  } else if (cleaned.startsWith('00258')) {
    // 00258 prefix: replace with 258
    cleaned = '258' + cleaned.slice(4);
  }
  
  // Validate final length (must be 12 digits: 258 + 9)
  if (cleaned.length !== 12 || !cleaned.startsWith('258')) {
    return null;
  }
  
  return cleaned;
}

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
 * Builds full WhatsApp URL with prefilled message (URL-encoded).
 * Returns null if the phone number is invalid.
 */
export function buildWhatsAppHref(whatsapp: string, message: string): string | null {
  const number = normalizeMozambiquePhone(whatsapp);
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  if (!message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * One-shot: build message and href for an ad (uses seller WhatsApp from ad).
 * Returns null if the phone number is invalid.
 */
export function buildWhatsAppUrl(ad: Ad, categoryName?: string): string | null {
  const message = buildWhatsAppMessage(ad, categoryName);
  return buildWhatsAppHref(ad.whatsapp, message);
}
