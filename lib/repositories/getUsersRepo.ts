import type { UsersRepository } from './usersRepo';
import { usersRepo } from './local/usersRepo.local';
import { usersRepoSupabase } from './supabase/usersRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

/** Returns the users repository: Supabase when VITE_USE_SUPABASE=true, otherwise local. */
export function getUsersRepo(): UsersRepository {
  return useSupabase ? usersRepoSupabase : usersRepo;
}
