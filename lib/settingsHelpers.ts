import { CONTACT_INFO, LIMITS } from '@/lib/constants';

/** Extract admin WhatsApp number from publicSettings (Supabase or local fallback). */
export function getAdminWhatsapp(publicSettings: Record<string, unknown>): string {
  const v = publicSettings.admin_whatsapp as { number?: string } | undefined;
  return v?.number?.replace(/\D/g, '') || CONTACT_INFO.WHATSAPP_RAW;
}

/** Extract activation fee in MT from publicSettings. */
export function getActivationFeeMzn(publicSettings: Record<string, unknown>): number {
  const v = publicSettings.activation_fee_mzn as { amount?: number } | undefined;
  return typeof v?.amount === 'number' ? v.amount : LIMITS.ACTIVATION_FEE_MT;
}
