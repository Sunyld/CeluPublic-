import type { User } from '@/types';
import type { AccountStatus } from '@/types';

/** For Supabase, create() is called with id = auth.user.id after signUp. */
export type CreateUserPayload = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };

export interface UsersRepository {
  list(filters?: { status?: AccountStatus; role?: string }): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getCurrentUserId(): string | null;
  setCurrentUserId(id: string | null): void;
  create(data: CreateUserPayload): Promise<User>;
  updateStatus(id: string, status: AccountStatus): Promise<User | null>;
  update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | null>;
}

export { usersRepo } from './local/usersRepo.local';
export { getUsersRepo } from './getUsersRepo';
