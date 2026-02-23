'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/context/ToastContext';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
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
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Check, X, UserCircle, Ban, Eye, Shield, ShieldOff } from 'lucide-react';
import { withTimeout } from '@/lib/errors';

const FETCH_TIMEOUT_MS = 12000;

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

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

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

function apiRowToUser(r: Record<string, unknown>): User {
    return {
        id: r.id as string,
        email: (r.email as string) || '',
        name: (r.name as string) || 'Utilizador',
        role: (r.role === 'admin' ? 'admin' : 'seller') as User['role'],
        status: (r.status as AccountStatus) || 'pending',
        accountType: r.accountType as AccountType | undefined,
        whatsapp: r.whatsapp as string | undefined,
        province: r.province as string | undefined,
        city: r.city as string | undefined,
        createdAt: (r.createdAt as string) || new Date().toISOString(),
        updatedAt: r.updatedAt as string | undefined,
    };
}

export default function AdminUsersPage() {
    const { user } = useAuth();
    const { users, setUsers, setAds, refreshAds, getAdsByUser } = useApp();
    const showToast = useToast().showToast;
    const [statusFilter, setStatusFilter] = useState<AccountStatus | ''>('');
    const [accountTypeFilter, setAccountTypeFilter] = useState<AccountType | ''>('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'admin'>('all');
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [updating, setUpdating] = useState(false);
    const [promoteTarget, setPromoteTarget] = useState<User | null>(null);
    const [demoteTarget, setDemoteTarget] = useState<User | null>(null);

    const loadUsers = useCallback(async () => {
        try {
            const r = await withTimeout(
                fetch('/api/admin/usuarios', { cache: 'no-store' }),
                FETCH_TIMEOUT_MS,
                'Carregar utilizadores'
            );
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                showToast({ variant: 'error', description: err.message ?? r.statusText });
                return;
            }
            const d = await r.json();
            const list = (d.users ?? []).map(apiRowToUser);
            setUsers(list);
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao carregar.' });
        }
    }, [setUsers, showToast]);

    useEffect(() => {
        if (user?.role === 'admin') void loadUsers();
    }, [user?.role, loadUsers]);

    const filteredUsers = useMemo(() => {
        let list = users;
        if (roleFilter === 'seller') list = list.filter((u) => u.role === 'seller');
        else if (roleFilter === 'admin') list = list.filter((u) => u.role === 'admin');
        if (statusFilter) list = list.filter((u) => u.status === statusFilter);
        if (accountTypeFilter) list = list.filter((u) => u.accountType === accountTypeFilter);
        return list.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [users, roleFilter, statusFilter, accountTypeFilter]);

    const handlePromote = useCallback(async () => {
        if (!promoteTarget) return;
        setUpdating(true);
        showToast({ variant: 'info', description: 'A promover...' });
        try {
            const r = await withTimeout(
                fetch('/api/admin/usuarios/promote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: promoteTarget.id }),
                }),
                FETCH_TIMEOUT_MS,
                'Promover'
            );
            const d = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(d.message ?? 'Erro ao promover');
            showToast({ variant: 'success', description: 'Utilizador promovido a admin.' });
            setUsers((prev) => prev.map((u) => (u.id === promoteTarget.id ? { ...u, role: 'admin' as const, status: 'approved' as const } : u)));
            setDetailUser((prev) => (prev?.id === promoteTarget.id ? { ...prev, role: 'admin', status: 'approved' } : prev));
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao promover.' });
        } finally {
            setUpdating(false);
            setPromoteTarget(null);
        }
    }, [promoteTarget, showToast, setUsers]);

    const handleDemote = useCallback(async () => {
        if (!demoteTarget) return;
        setUpdating(true);
        showToast({ variant: 'info', description: 'A remover admin...' });
        try {
            const r = await withTimeout(
                fetch('/api/admin/usuarios/demote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: demoteTarget.id }),
                }),
                FETCH_TIMEOUT_MS,
                'Remover admin'
            );
            const d = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(d.message ?? 'Erro ao remover admin');
            showToast({ variant: 'success', description: 'Cargo de admin removido.' });
            setUsers((prev) => prev.map((u) => (u.id === demoteTarget.id ? { ...u, role: 'seller' as const } : u)));
            setDetailUser((prev) => (prev?.id === demoteTarget.id ? { ...prev, role: 'seller' } : prev));
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao remover admin.' });
        } finally {
            setUpdating(false);
            setDemoteTarget(null);
        }
    }, [demoteTarget, showToast, setUsers]);

    const updateStatus = useCallback(
        async (u: User, status: AccountStatus) => {
            setUpdating(true);
            showToast({ variant: 'info', description: 'A atualizar...' });
            try {
                const r = await withTimeout(
                    fetch(`/api/admin/usuarios/${u.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status }),
                        cache: 'no-store',
                    }),
                    FETCH_TIMEOUT_MS,
                    'Atualizar estado'
                );
                if (!r.ok) {
                    const err = await r.json().catch(() => ({}));
                    throw new Error(err.message ?? 'Erro ao atualizar');
                }
                showToast({ variant: 'success', description: 'Estado atualizado.' });
                setDetailUser((prev) => (prev?.id === u.id ? { ...prev, status } : prev));
                if (status === 'blocked' || status === 'rejected') {
                    if (USE_SUPABASE) {
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
                await loadUsers();
            } catch (e) {
                showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao atualizar.' });
            } finally {
                setUpdating(false);
            }
        },
        [setAds, refreshAds, getAdsByUser, loadUsers, showToast]
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
                    Gerir contas: aprovar, rejeitar, bloquear. Promover ou remover admin.
                </p>
            </div>

            <ConfirmDialog
                open={!!promoteTarget}
                onOpenChange={(open) => !open && setPromoteTarget(null)}
                title="Tornar administrador"
                description={promoteTarget ? `Tem certeza que deseja promover ${promoteTarget.name} a administrador?` : ''}
                confirmLabel="Promover"
                cancelLabel="Cancelar"
                onConfirm={handlePromote}
                destructive={false}
                loading={updating}
            />
            <ConfirmDialog
                open={!!demoteTarget}
                onOpenChange={(open) => !open && setDemoteTarget(null)}
                title="Remover administrador"
                description={demoteTarget ? `Tem certeza que deseja remover o cargo de admin de ${demoteTarget.name}?` : ''}
                confirmLabel="Remover admin"
                cancelLabel="Cancelar"
                onConfirm={handleDemote}
                destructive
                loading={updating}
            />

            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <UserCircle className="h-4 w-4" />
                        Utilizadores
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'seller' | 'admin')}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <option value="all">Todos</option>
                            <option value="seller">Vendedores</option>
                            <option value="admin">Admins</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as AccountStatus | '')}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                                    <th className="pb-2 pr-4 font-medium">Função</th>
                                    <th className="pb-2 pr-4 font-medium">WhatsApp</th>
                                    <th className="pb-2 pr-4 font-medium">Estado</th>
                                    <th className="pb-2 pr-4 font-medium">Registo</th>
                                    <th className="pb-2 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-3 pr-4">
                                            <div className="font-medium">{u.name}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role === 'admin' ? 'Admin' : 'Vendedor'}</Badge>
                                        </td>
                                        <td className="py-3 pr-4">{u.whatsapp ?? '—'}</td>
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
                                                {u.role === 'seller' && (
                                                    <AppButton variant="outline" size="sm" className="h-8 gap-1" disabled={updating} onClick={() => setPromoteTarget(u)} title="Tornar admin">
                                                        <Shield className="h-3 w-3" /> Admin
                                                    </AppButton>
                                                )}
                                                {u.role === 'admin' && (
                                                    <AppButton variant="ghost" size="sm" className="h-8 gap-1 text-destructive" disabled={updating} onClick={() => setDemoteTarget(u)} title="Remover admin">
                                                        <ShieldOff className="h-3 w-3" /> Remover
                                                    </AppButton>
                                                )}
                                                {u.status === 'pending' && u.role === 'seller' && (
                                                    <>
                                                        <AppButton variant="primary" size="sm" className="h-8" disabled={updating} onClick={() => approveUser(u)}>
                                                            Aprovar
                                                        </AppButton>
                                                        <AppButton variant="destructive" size="sm" className="h-8" disabled={updating} onClick={() => rejectUser(u)}>
                                                            Rejeitar
                                                        </AppButton>
                                                    </>
                                                )}
                                                {u.status === 'blocked' && (
                                                    <AppButton variant="outline" size="sm" className="h-8" disabled={updating} onClick={() => unblockUser(u)}>
                                                        Desbloquear
                                                    </AppButton>
                                                )}
                                                {u.status === 'approved' && (
                                                    <AppButton variant="ghost" size="sm" className="h-8 text-destructive" disabled={updating} onClick={() => blockUser(u)}>
                                                        <Ban className="h-3 w-3 mr-1" /> Bloquear
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
                            Nenhum utilizador encontrado.
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
                            <div className="grid gap-4 py-4 text-sm">
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Nome:</span>
                                    <span className="col-span-2">{detailUser.name}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Email:</span>
                                    <span className="col-span-2">{detailUser.email}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">WhatsApp:</span>
                                    <span className="col-span-2">{detailUser.whatsapp ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Província:</span>
                                    <span className="col-span-2">{detailUser.province ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Cidade/Localidade:</span>
                                    <span className="col-span-2">{detailUser.city ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Função:</span>
                                    <div className="col-span-2"><Badge variant={detailUser.role === 'admin' ? 'default' : 'secondary'}>{detailUser.role === 'admin' ? 'Admin' : 'Vendedor'}</Badge></div>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Tipo:</span>
                                    <span className="col-span-2">{detailUser.accountType ?? '—'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 items-center">
                                    <span className="text-muted-foreground font-medium">Estado:</span>
                                    <div className="col-span-2"><Badge variant={statusBadgeVariant(detailUser.status)}>{detailUser.status}</Badge></div>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium">Criado em:</span>
                                    <span className="col-span-2">{formatDate(detailUser.createdAt)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
