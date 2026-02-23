'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Layers, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Category } from '@/types';
import { withTimeout } from '@/lib/errors';

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
const FETCH_TIMEOUT_MS = 12000;

function slugFromName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function rowToCategory(r: { id: string; name: string; slug: string; icon?: string | null }): Category {
    return { id: r.id, name: r.name, slug: r.slug, icon: r.icon ?? undefined };
}

export default function AdminCategoriesPage() {
    const { categories, ads, setCategories } = useApp();
    const showToast = useToast().showToast;
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editSlug, setEditSlug] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const loadCategories = useCallback(async () => {
        try {
            const r = await withTimeout(fetch('/api/admin/categorias', { cache: 'no-store' }), FETCH_TIMEOUT_MS, 'Carregar categorias');
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                showToast({ variant: 'error', description: err.message ?? r.statusText });
                return;
            }
            const data = await r.json();
            setCategories((Array.isArray(data) ? data : []).map(rowToCategory));
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao carregar.' });
        }
    }, [setCategories, showToast]);

    useEffect(() => {
        void loadCategories();
    }, [loadCategories]);

    const withCount = categories.map((c) => ({
        ...c,
        adCount: ads.filter((a) => a.status === 'published' && a.categoryId === c.id).length,
    }));

    const handleAdd = async () => {
        const name = newName.trim();
        const slug = newSlug.trim() || slugFromName(name);
        if (!name || !slug) return;
        setSubmitting(true);
        showToast({ variant: 'info', description: 'A criar...' });
        try {
            const r = await withTimeout(
                fetch('/api/admin/categorias', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, slug }),
                    cache: 'no-store',
                }),
                FETCH_TIMEOUT_MS,
                'Criar categoria'
            );
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                throw new Error(err.message ?? 'Erro ao criar categoria');
            }
            const created = await r.json();
            setCategories((prev) => [...prev, rowToCategory(created)]);
            setNewName('');
            setNewSlug('');
            showToast({ variant: 'success', description: 'Categoria criada.' });
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao criar.' });
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (c: Category) => {
        setEditingId(c.id);
        setEditName(c.name);
        setEditSlug(c.slug);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        const name = editName.trim();
        const slug = editSlug.trim();
        if (!name || !slug) return;
        setSubmitting(true);
        showToast({ variant: 'info', description: 'A guardar...' });
        try {
            const r = await withTimeout(
                fetch(`/api/admin/categorias/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, slug }),
                    cache: 'no-store',
                }),
                FETCH_TIMEOUT_MS,
                'Atualizar categoria'
            );
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                throw new Error(err.message ?? 'Erro ao atualizar');
            }
            const updated = await r.json();
            setCategories((prev) =>
                prev.map((c) => (c.id === editingId ? rowToCategory(updated) : c))
            );
            setEditingId(null);
            showToast({ variant: 'success', description: 'Categoria atualizada.' });
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao atualizar.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        setSubmitting(true);
        showToast({ variant: 'info', description: 'A eliminar...' });
        try {
            const r = await withTimeout(
                fetch(`/api/admin/categorias/${categoryToDelete.id}`, { method: 'DELETE', cache: 'no-store' }),
                FETCH_TIMEOUT_MS,
                'Eliminar categoria'
            );
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                throw new Error(err.message ?? 'Erro ao eliminar');
            }
            setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
            setCategoryToDelete(null);
            showToast({ variant: 'success', description: 'Categoria eliminada.' });
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao eliminar.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={!!categoryToDelete}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
                title="Eliminar categoria"
                description="Tem certeza que deseja eliminar esta categoria? Anúncios associados podem ficar sem categoria."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmDelete}
                destructive
                loading={submitting}
            />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
                <p className="text-sm text-muted-foreground">
                    Gerir as categorias de produtos e serviços disponíveis no marketplace.
                </p>
            </div>

            {USE_SUPABASE && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Plus className="h-4 w-4" />
                            Adicionar nova categoria
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2 min-w-[200px]">
                            <Label htmlFor="cat-name">Nome</Label>
                            <Input
                                id="cat-name"
                                value={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                    if (!newSlug || newSlug === slugFromName(newName)) setNewSlug(slugFromName(e.target.value));
                                }}
                                placeholder="Ex: Eletrónica"
                            />
                        </div>
                        <div className="space-y-2 min-w-[200px]">
                            <Label htmlFor="cat-slug">Slug (URL)</Label>
                            <Input
                                id="cat-slug"
                                value={newSlug}
                                onChange={(e) => setNewSlug(e.target.value)}
                                placeholder="Ex: eletronica"
                            />
                        </div>
                        <AppButton onClick={handleAdd} disabled={!newName.trim() || submitting} className="gap-2">
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Adicionar
                        </AppButton>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Layers className="h-4 w-4 text-primary" />
                        Categorias registadas ({withCount.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {withCount.length === 0 ? (
                        <p className="py-8 text-center text-muted-foreground">Nenhuma categoria configurada.</p>
                    ) : (
                        <div className="grid gap-2">
                            {withCount.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30"
                                >
                                    {editingId === c.id ? (
                                        <>
                                            <div className="flex flex-wrap items-center gap-4 flex-1">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nome</Label>
                                                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9 w-48" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Slug</Label>
                                                    <Input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="h-9 w-40" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <AppButton size="sm" onClick={saveEdit} disabled={submitting}>
                                                    {submitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                                    Guardar
                                                </AppButton>
                                                <AppButton size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                                    Cancelar
                                                </AppButton>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{c.name}</h4>
                                                <p className="text-xs text-muted-foreground">slug: {c.slug} · {c.adCount} anúncios ativos</p>
                                            </div>
                                            {USE_SUPABASE && (
                                                <div className="flex items-center gap-1">
                                                    <AppButton
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => startEdit(c)}
                                                        className="h-8 w-8 text-muted-foreground"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </AppButton>
                                                    <AppButton
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setCategoryToDelete(c)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </AppButton>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
