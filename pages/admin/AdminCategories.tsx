import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getCategoriesRepo } from '@/lib/repositories/getCategoriesRepo';
import { useSupabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Layers, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Category } from '@/types';

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AdminCategories() {
  const { categories, ads, refreshCategories } = useApp();
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const withCount = categories.map((c) => ({
    ...c,
    adCount: ads.filter((a) => a.status === 'published' && a.categoryId === c.id).length,
  }));

  const handleAdd = async () => {
    const name = newName.trim();
    const slug = newSlug.trim() || slugFromName(name);
    if (!name || !slug) return;
    setSubmitting(true);
    try {
      await getCategoriesRepo().create({ name, slug });
      await refreshCategories();
      setNewName('');
      setNewSlug('');
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
    try {
      await getCategoriesRepo().update(editingId, { name, slug });
      await refreshCategories();
      setEditingId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setSubmitting(true);
    try {
      await getCategoriesRepo().delete(categoryToDelete.id);
      await refreshCategories();
      setCategoryToDelete(null);
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
        description="Tem certeza? Anúncios com esta categoria podem ficar órfãos."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        destructive
      />
      <div>
        <h2 className="text-lg font-semibold">Categorias</h2>
        <p className="text-sm text-muted-foreground">
          {useSupabase
            ? 'Categorias da plataforma. Adicione, edite ou remova.'
            : 'Categorias disponíveis na plataforma (geridas por código/seed).'}
        </p>
      </div>

      {useSupabase && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" />
              Nova categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Nome</Label>
              <Input
                id="cat-name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (!newSlug) setNewSlug(slugFromName(e.target.value));
                }}
                placeholder="Ex: Eletrónica"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="eletronica"
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
            <Layers className="h-4 w-4" />
            Lista de categorias ({withCount.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withCount.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Nenhuma categoria.</p>
          ) : (
            <ul className="space-y-2">
              {withCount.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  {editingId === c.id ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-40"
                        />
                        <Input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <AppButton size="sm" onClick={saveEdit} disabled={submitting} className="gap-1">
                          Guardar
                        </AppButton>
                        <AppButton size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancelar
                        </AppButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{c.name}</span>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        {c.slug} · {c.adCount} anúncios
                        {useSupabase && (
                          <>
                            <AppButton
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(c)}
                              className="h-8 w-8 p-0"
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </AppButton>
                            <AppButton
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => setCategoryToDelete(c)}
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </AppButton>
                          </>
                        )}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
