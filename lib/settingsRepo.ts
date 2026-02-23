/**
 * Admin/site settings (e.g. admin_whatsapp, activation_fee_mzn).
 * Local mode uses constants; Supabase mode uses public.admin_settings.
 */

export type PublicSettingKey = 'admin_whatsapp' | 'activation_fee_mzn' | 'support_email';

export interface SettingsRepository {
  get(key: string): Promise<unknown>;
  listPublic(): Promise<Record<string, unknown>>;
  update(key: string, value: unknown): Promise<void>;
}

export { settingsRepo } from './local/settingsRepo.local';
