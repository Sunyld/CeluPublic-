/**
 * Supabase implementation: profiles table + Auth.
 * Requires RLS policies (profiles_insert_own: auth.uid() = id) so client can create own profile.
 */
import type { User, AccountStatus } from '@/types';
import type { UsersRepository, CreateUserPayload } from '../usersRepo';
import { getSupabase } from '@/lib/supabaseClient';
import { AppError, ERROR_CODES } from '@/lib/errors';

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  role: string;
  status: string;
  account_type: string | null;
  created_at: string;
  updated_at: string;
};

function rowToUser(row: ProfileRow): User {
  if (!row) throw new Error('[USERS_REPO] Invalid profile row');
  return {
    id: row.id,
    email: row.email || '',
    name: row.full_name || 'Utilizador',
    role: (row.role === 'admin' ? 'admin' : 'seller') as User['role'],
    status: (row.status || 'pending') as AccountStatus,
    accountType: row.account_type as User['accountType'] ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    city: row.city ?? undefined,
    province: row.province ?? undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

let currentUserId: string | null = null;

export const usersRepoSupabase: UsersRepository = {
  getCurrentUserId() {
    return currentUserId;
  },

  setCurrentUserId(id: string | null) {
    currentUserId = id;
  },

  async list(filters) {
    const supabase = getSupabase();
    if (!supabase) return [];

    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.role) query = query.eq('role', filters.role);

    const { data, error } = await query;
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][usersRepo.list]', error);
      if (error.code === 'PGRST116' || error.message?.includes('policy')) {
        return [];
      }
      throw new AppError(ERROR_CODES.UNAUTHORIZED, error.message);
    }
    return (data as ProfileRow[]).map(rowToUser);
  },

  async getById(id: string) {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      // Use maybeSingle() instead of single() to avoid 406 when profile doesn't exist yet.
      // This is expected during signup flow - fallback /api/profile/ensure will create it.
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      
      // maybeSingle() returns null data when no rows found (no error), or error for real issues
      if (error) {
        // Only log real errors (not "not found" - that's handled by data === null)
        // Check for RLS recursion error (42P17)
        if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('infinite')) {
          // eslint-disable-next-line no-console
          console.error(
            '[RLS] profiles policy recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_no_recursion.sql is applied'
          );
        } else if (error.code !== 'PGRST116') {
          // PGRST116 = "The result contains 0 rows" - expected, don't log
          // eslint-disable-next-line no-console
          console.error('[SUPABASE ERROR][usersRepo.getById]', {
            code: error.code,
            message: error.message,
            details: error.details,
          });
        }
        return null;
      }
      
      // data === null means profile doesn't exist yet (expected during signup)
      if (!data) {
        return null;
      }
      
      return rowToUser(data as ProfileRow);
    } catch (err: any) {
      // Catch any unexpected errors (network, etc.)
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][usersRepo.getById] unexpected error:', err);
      return null;
    }
  },

  async create(data: CreateUserPayload) {
    const supabase = getSupabase();
    if (!supabase) throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Supabase not configured');

    const id = data.id ?? crypto.randomUUID();
    const now = new Date().toISOString();
    const email = (data.email ?? '').toLowerCase();
    const row = {
      id,
      full_name: data.name ?? '',
      email,
      whatsapp: data.whatsapp ?? null,
      province: data.province ?? null,
      city: data.city ?? null,
      role: data.role ?? 'seller',
      status: data.status ?? 'pending',
      account_type: data.accountType ?? null,
      created_at: now,
      updated_at: now,
    };

    const { data: inserted, error } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][usersRepo.create]', error);
      throw new AppError(ERROR_CODES.UNAUTHORIZED, error.message);
    }
    return rowToUser(inserted as ProfileRow);
  },

  async updateStatus(id: string, status: AccountStatus) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][usersRepo.updateStatus]', error);
      }
      return null;
    }
    return rowToUser(data as ProfileRow);
  },

  async update(id: string, payload: Partial<Omit<User, 'id'>>) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (payload.name != null) updates.full_name = payload.name;
    if (payload.email != null) updates.email = payload.email;
    if (payload.whatsapp != null) updates.whatsapp = payload.whatsapp;
    if (payload.province != null) updates.province = payload.province;
    if (payload.city != null) updates.city = payload.city;
    if (payload.role != null) updates.role = payload.role;
    if (payload.status != null) updates.status = payload.status;
    if (payload.accountType != null) updates.account_type = payload.accountType;

    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (error || !data) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][usersRepo.update]', error);
      }
      return null;
    }
    return rowToUser(data as ProfileRow);
  },
};
