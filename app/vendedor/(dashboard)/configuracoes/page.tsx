'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApp } from '@/context/AppContext';
import { getUsersRepo } from '@/lib/repositories/getUsersRepo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AppButton } from '@/components/ui/app-button';
import { PROVINCIAS_MOCAMBIQUE } from '@/lib/constants';

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export default function SellerSettingsPage() {
    const { user, refreshProfile } = useAuth();
    const { setUsers, refreshUsers } = useApp();
    const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
    const [province, setProvince] = useState(user?.province ?? '');
    const [saved, setSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (USE_SUPABASE) {
                await getUsersRepo().update(user.id, { whatsapp: whatsapp.trim(), province: province.trim() });
                await refreshProfile();
                await refreshUsers();
            } else {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === user.id
                            ? { ...u, whatsapp: whatsapp.trim(), province: province.trim(), updatedAt: new Date().toISOString() }
                            : u
                    )
                );
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        O nome e email não são editáveis. Pode atualizar o seu WhatsApp e província.
                    </p>
                    <p className="text-sm"><span className="text-muted-foreground">Nome:</span> {user.name}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Email:</span> {user.email}</p>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label htmlFor="profile-whatsapp">WhatsApp</Label>
                            <Input
                                id="profile-whatsapp"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="84 000 0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profile-province">Província</Label>
                            <select
                                id="profile-province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                <option value="">Selecione</option>
                                {PROVINCIAS_MOCAMBIQUE.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <AppButton type="submit" disabled={submitting}>
                            {saved ? 'Alterações guardadas' : submitting ? 'A guardar...' : 'Guardar alterações'}
                        </AppButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
