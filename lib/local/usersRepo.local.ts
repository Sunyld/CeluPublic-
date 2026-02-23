import type { User, AccountStatus } from '@/types';
import type { UsersRepository, CreateUserPayload } from '../usersRepo';
import { storage } from '@/lib/storage';

export const usersRepo: UsersRepository = {
  async list(filters) {
    let list = storage.getUsers();
    if (filters?.status) list = list.filter((u) => u.status === filters.status);
    if (filters?.role) list = list.filter((u) => u.role === filters.role);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string) {
    return storage.getUsers().find((u) => u.id === id) ?? null;
  },

  getCurrentUserId() {
    return storage.getCurrentUserId();
  },

  setCurrentUserId(id: string | null) {
    storage.setCurrentUserId(id);
  },

  async create(data: CreateUserPayload) {
    const now = new Date().toISOString();
    const user: User = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const users = storage.getUsers();
    storage.setUsers([...users, user]);
    return user;
  },

  async updateStatus(id: string, status: AccountStatus) {
    const users = storage.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    const updated: User = { ...users[index], status, updatedAt: now };
    const next = [...users];
    next[index] = updated;
    storage.setUsers(next);
    return updated;
  },

  async update(id: string, data: Partial<Omit<User, 'id'>>) {
    const users = storage.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    const updated: User = { ...users[index], ...data, updatedAt: now };
    const next = [...users];
    next[index] = updated;
    storage.setUsers(next);
    return updated;
  },
};
