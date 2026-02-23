import type { SettingsRepository } from '../settingsRepo';
import { getSupabase } from '@/lib/supabaseClient';
import { AppError, ERROR_CODES } from '@/lib/errors';

const PUBLIC_KEYS = ['admin_whatsapp', 'activation_fee_mzn', 'support_email'] as const;

export const settingsRepoSupabase: SettingsRepository = {
  async get(key: string) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][settingsRepo.get]', error);
      return null;
    }
    return data?.value ?? null;
  },

  async listPublic() {
    const supabase = getSupabase();
    if (!supabase) return {};

    const { data, error } = await supabase
      .from('admin_settings')
      .select('key, value')
      .in('key', [...PUBLIC_KEYS]);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][settingsRepo.listPublic]', error);
      return {};
    }
    const out: Record<string, unknown> = {};
    for (const row of data ?? []) {
      const r = row as { key: string; value: unknown };
      out[r.key] = r.value;
    }
    return out;
  },

  async update(key: string, value: unknown) {
    const supabase = getSupabase();
    if (!supabase) throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Supabase not configured');

    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][settingsRepo.update]', error);
      throw new AppError(ERROR_CODES.UNAUTHORIZED, error.message);
    }
  },
};
