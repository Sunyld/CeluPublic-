'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/context/ToastContext';
import { Check, X, Eye, Loader2, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type SellerRequest = {
    id: string;
    user_id: string;
    created_at: string;
    status: 'pending' | 'approved' | 'rejected';
    payment_method?: string;
    payment_reference?: string;
    amount_mzn?: number;
    receipt_url?: string;
    admin_note?: string;
    updated_at?: string;
    profiles: {
        full_name: string;
        email: string;
        whatsapp: string;
    };
};

export default function AdminSolicitacoes() {
    const [requests, setRequests] = useState<SellerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const loadRequests = useCallback(async () => {
        setLoading(true);
        try {
            console.log('[ADMIN/SOLICITACOES] Loading requests via API...');

            // Usar API server-side (service role) para garantir que o admin vê os dados
            const res = await fetch('/api/admin/solicitacoes', {
                credentials: 'include',
                headers: { Accept: 'application/json' }
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                const msg = body?.error || res.statusText || 'Erro ao carregar';
                if (res.status === 401 || res.status === 403) {
                    showToast({ variant: 'error', title: 'Acesso negado', description: msg });
                } else {
                    showToast({ variant: 'error', title: 'Erro ao carregar solicitações', description: msg });
                }
                setRequests([]);
                return;
            }

            const data = await res.json();
            const merged = Array.isArray(data.requests) ? data.requests : [];
            const total = data.total ?? merged.length;

            console.log('[ADMIN/SOLICITACOES] Found requests:', total);

            if (merged.length === 0) {
                console.warn('[ADMIN/SOLICITACOES] seller_requests empty - data comes from server (service role). Verify backfill and /api/profile/ensure.');
            }

            setRequests(merged);
        } catch (err: any) {
            console.error('[ADMIN/SOLICITACOES] Unexpected error:', err?.message ?? err);
            showToast({
                variant: 'error',
                title: 'Erro ao carregar solicitações',
                description: err?.message || 'Erro desconhecido'
            });
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleApprove = async (req: SellerRequest) => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/solicitacoes/approve', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: req.id, userId: req.user_id })
            });

            const data = await res.json().catch(() => ({}));
            const msg = data?.error || res.statusText;

            if (!res.ok) {
                showToast({ variant: 'error', title: 'Erro ao aprovar', description: msg });
                return;
            }

            showToast({ variant: 'success', title: 'Vendedor aprovado!', description: 'O vendedor agora tem acesso ao painel.' });
            setRequests((prev) => prev.filter((r) => r.id !== req.id));
        } catch (err: any) {
            showToast({ variant: 'error', title: 'Erro ao aprovar', description: err?.message || 'Erro desconhecido' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectionReason) return;
        setSubmitting(true);
        const req = selectedRequest;
        try {
            const res = await fetch('/api/admin/solicitacoes/reject', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: req.id,
                    userId: req.user_id,
                    reason: rejectionReason
                })
            });

            const data = await res.json().catch(() => ({}));
            const msg = data?.error || res.statusText;

            if (!res.ok) {
                showToast({ variant: 'error', title: 'Erro ao rejeitar', description: msg });
                return;
            }

            showToast({ variant: 'success', title: 'Solicitação rejeitada.', description: 'O vendedor verá a mensagem no dashboard.' });
            setSelectedRequest(null);
            setRejectionReason('');
            setRequests((prev) => prev.filter((r) => r.id !== req.id));
        } catch (err: any) {
            showToast({ variant: 'error', title: 'Erro ao rejeitar', description: err?.message || 'Erro desconhecido' });
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-MZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Solicitações de Ativação</h2>
                <p className="text-sm text-muted-foreground">
                    Analise os pagamentos dos novos vendedores.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Pedidos pendentes e recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground uppercase text-[10px] tracking-wider">
                                        <th className="pb-3 pr-4 font-bold">Data</th>
                                        <th className="pb-3 pr-4 font-bold">Vendedor</th>
                                        <th className="pb-3 pr-4 font-bold">Método</th>
                                        <th className="pb-3 pr-4 font-bold">Referência</th>
                                        <th className="pb-3 pr-4 font-bold">Estado</th>
                                        <th className="pb-3 font-bold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req) => (
                                        <tr key={req.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="py-4 pr-4 text-xs">
                                                {formatDate(req.created_at)}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="font-semibold">{req.profiles?.full_name || 'Usuário'}</div>
                                                <div className="text-[10px] text-muted-foreground">{req.profiles?.email}</div>
                                                <div className="text-[10px] text-primary">{req.profiles?.whatsapp}</div>
                                            </td>
                                            <td className="py-4 pr-4 font-medium">{req.payment_method || 'N/A'}</td>
                                            <td className="py-4 pr-4 text-xs">
                                                <div className="font-mono">{req.payment_reference || 'N/A'}</div>
                                                <div className="text-primary font-bold">20 MT</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Badge variant={
                                                    req.status === 'approved' ? 'default' :
                                                        req.status === 'pending' ? 'secondary' : 'destructive'
                                                }>
                                                    {req.status === 'pending' ? 'Pendente' :
                                                        req.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <AppButton
                                                                size="sm"
                                                                className="h-8 bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
                                                                onClick={() => handleApprove(req)}
                                                                disabled={submitting}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </AppButton>
                                                            <AppButton
                                                                size="sm"
                                                                variant="destructive"
                                                                className="h-8 hover:scale-105 active:scale-95 transition-all"
                                                                onClick={() => setSelectedRequest(req)}
                                                                disabled={submitting}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </AppButton>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {requests.length === 0 && (
                                <div className="text-center py-12 space-y-2">
                                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                                    <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejeitar Solicitação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Motivo da Rejeição</Label>
                            <Input
                                placeholder="Ex: Referência não encontrada no sistema."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <AppButton variant="ghost" onClick={() => setSelectedRequest(null)}>Cancelar</AppButton>
                        <AppButton
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectionReason || submitting}
                        >
                            Confirmar Rejeição
                        </AppButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
