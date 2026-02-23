/**
 * API de utilizadores para MVP (localStorage).
 * Superfície preparada para trocar por Supabase depois.
 */

import type { User, AccountStatus, AccountType } from '@/types';
import { storage } from './storage';

export type CreateUserPayload = {
  full_name: string;
  email: string;
  password: string;
  account_type: AccountType;
  whatsapp: string;
  city: string;
};

export type UserFilters = {
  status?: AccountStatus;
  account_type?: AccountType;
};

export function createUser(payload: CreateUserPayload): User | null {
  const users = storage.getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) return null;

  const now = new Date().toISOString();
  const newUser: User = {
    id: crypto.randomUUID(),
    email: payload.email.trim().toLowerCase(),
    name: payload.full_name.trim(),
    role: 'seller',
    status: 'pending',
    accountType: payload.account_type,
    whatsapp: payload.whatsapp.trim(),
    city: payload.city.trim(),
    createdAt: now,
    updatedAt: now,
  };
  storage.setUsers([...users, newUser]);
  return newUser;
}

export function getCurrentUser(): User | null {
  const userId = storage.getCurrentUserId();
  if (!userId) return null;
  return getProfile(userId);
}

export function getProfile(userId: string): User | null {
  const users = storage.getUsers();
  return users.find((u) => u.id === userId) ?? null;
}

export function listUsers(filters?: UserFilters): User[] {
  let list = storage.getUsers();
  if (filters?.status) {
    list = list.filter((u) => u.status === filters.status);
  }
  if (filters?.account_type) {
    list = list.filter((u) => u.accountType === filters.account_type);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateUserStatus(userId: string, status: AccountStatus): User | null {
  const users = storage.getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;
  const now = new Date().toISOString();
  const updated: User = { ...users[index], status, updatedAt: now };
  const next = [...users];
  next[index] = updated;
  storage.setUsers(next);
  return updated;
}
