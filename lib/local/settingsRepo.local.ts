import type { SettingsRepository } from '../settingsRepo';
import { WHATSAPP_ADMIN, LIMITS } from '@/lib/constants';

const FALLBACK_PUBLIC: Record<string, unknown> = {
  admin_whatsapp: { number: WHATSAPP_ADMIN },
  activation_fee_mzn: { amount: LIMITS.ACTIVATION_FEE_MT },
};

export const settingsRepo: SettingsRepository = {
  async get(key: string) {
    return FALLBACK_PUBLIC[key] ?? null;
  },

  async listPublic() {
    return { ...FALLBACK_PUBLIC };
  },

  async update() {
    // Local mode: no-op; settings are constants
  },
};
