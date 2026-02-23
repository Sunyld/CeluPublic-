import { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { getUsersRepo } from '@/lib/repositories/getUsersRepo';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
import { useSupabase } from '@/lib/supabaseClient';
import type { User, AccountStatus, AccountType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, X, UserCircle, Ban, Eye, ShieldOff } from 'lucide-react';

const STATUS_OPTIONS: { value: AccountStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'rejected', label: 'Rejeitado' },
  { value: 'blocked', label: 'Bloqueado' },
];

const ACCOUNT_TYPE_OPTIONS: { value: AccountType | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'seller', label: 'Vendedor' },
  { value: 'provider', label: 'Prestador' },
  { value: 'both', label: 'Ambos' },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function statusBadgeVariant(status: AccountStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'approved') return 'default';
  if (status === 'pending') return 'secondary';
  return 'destructive';
}

export function AdminUsers() {
  const { user } = useAuth();
  const { users, setAds, refreshAds, getAdsByUser, refreshUsers } = useApp();
  const [statusFilter, setStatusFilter] = useState<AccountStatus | ''>('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<AccountType | ''>('');
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [updating, setUpdating] = useState(false);

  const sellerUsers = useMemo(
    () => users.filter((u) => u.role === 'seller'),
    [users]
  );

  const filteredUsers = useMemo(() => {
    let list = sellerUsers;
    if (statusFilter) list = list.filter((u) => u.status === statusFilter);
    if (accountTypeFilter) list = list.filter((u) => u.accountType === accountTypeFilter);
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [sellerUsers, statusFilter, accountTypeFilter]);

  const updateStatus = useCallback(
    async (u: User, status: AccountStatus) => {
      setUpdating(true);
      try {
        await getUsersRepo().updateStatus(u.id, status);
        setDetailUser((prev) => (prev?.id === u.id ? { ...prev, status } : prev));
        if (status === 'blocked' || status === 'rejected') {
          if (useSupabase) {
            const userAds = getAdsByUser(u.id);
            const repo = getAdsRepo();
            for (const ad of userAds) {
              await repo.update(ad.id, { status: 'hidden' });
            }
            await refreshAds();
          } else {
            const now = new Date().toISOString();
            setAds((prev) =>
              prev.map((a) =>
                a.userId === u.id ? { ...a, status: 'hidden' as const, updatedAt: now } : a
              )
            );
          }
        }
        await refreshUsers();
      } finally {
        setUpdating(false);
      }
    },
    [setAds, refreshAds, getAdsByUser, refreshUsers]
  );

  const approveUser = (u: User) => updateStatus(u, 'approved');
  const rejectUser = (u: User) => updateStatus(u, 'rejected');
  const blockUser = (u: User) => updateStatus(u, 'blocked');
  const unblockUser = (u: User) => updateStatus(u, 'approved');

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Utilizadores</h2>
        <p className="text-sm text-muted-foreground">
          Gerir contas de vendedores e prestadores: aprovar, rejeitar ou bloquear.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCircle className="h-4 w-4" />
            Contas vendedor/prestador
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AccountStatus | '')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value as AccountType | '')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Nome</th>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 pr-4 font-medium">WhatsApp</th>
                  <th className="pb-2 pr-4 font-medium">Cidade</th>
                  <th className="pb-2 pr-4 font-medium">Tipo</th>
                  <th className="pb-2 pr-4 font-medium">Estado</th>
                  <th className="pb-2 pr-4 font-medium">Registo</th>
                  <th className="pb-2 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{u.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 pr-4">{u.whatsapp ?? '—'}</td>
                    <td className="py-3 pr-4">{u.city ?? '—'}</td>
                    <td className="py-3 pr-4">{u.accountType ?? '—'}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusBadgeVariant(u.status)}>{u.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <AppButton
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setDetailUser(u)}
                          aria-label="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </AppButton>
                        {u.status === 'pending' && (
                          <>
                            <AppButton variant="primary" size="sm" className="gap-1" disabled={updating} onClick={() => approveUser(u)}>
                              <Check className="h-3 w-3" /> Aprovar
                            </AppButton>
                            <AppButton variant="destructive" size="sm" className="gap-1" disabled={updating} onClick={() => rejectUser(u)}>
                              <X className="h-3 w-3" /> Rejeitar
                            </AppButton>
                            <AppButton variant="outline" size="sm" className="gap-1" disabled={updating} onClick={() => blockUser(u)}>
                              <Ban className="h-3 w-3" /> Bloquear
                            </AppButton>
                          </>
                        )}
                        {u.status === 'blocked' && (
                          <AppButton variant="outline" size="sm" className="gap-1" disabled={updating} onClick={() => unblockUser(u)}>
                            <ShieldOff className="h-3 w-3" /> Desbloquear
                          </AppButton>
                        )}
                        {u.status === 'rejected' && (
                          <AppButton variant="outline" size="sm" className="gap-1" disabled={updating} onClick={() => approveUser(u)}>
                            <Check className="h-3 w-3" /> Aprovar
                          </AppButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum utilizador encontrado com os filtros seleccionados.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <DialogContent className="sm:max-w-md">
          {detailUser && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do utilizador</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 text-sm">
                <p><span className="text-muted-foreground">Nome:</span> {detailUser.name}</p>
                <p><span className="text-muted-foreground">Email:</span> {detailUser.email}</p>
                <p><span className="text-muted-foreground">WhatsApp:</span> {detailUser.whatsapp ?? '—'}</p>
                <p><span className="text-muted-foreground">Cidade:</span> {detailUser.city ?? '—'}</p>
                <p><span className="text-muted-foreground">Tipo de conta:</span> {detailUser.accountType ?? '—'}</p>
                <p><span className="text-muted-foreground">Estado:</span> <Badge variant={statusBadgeVariant(detailUser.status)}>{detailUser.status}</Badge></p>
                <p><span className="text-muted-foreground">Criado em:</span> {formatDate(detailUser.createdAt)}</p>
                {detailUser.updatedAt && <p><span className="text-muted-foreground">Atualizado:</span> {formatDate(detailUser.updatedAt)}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
