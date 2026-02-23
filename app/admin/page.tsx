'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, UserCheck, MessageCircle, Ban, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getPublicAds } from '@/lib/selectors/adsSelectors';
import { getCachedClickStatsLast7Days } from '@/lib/cachedData';
import { getClicksRepo } from '@/lib/repositories/getClicksRepo';
import { getMessageForError } from '@/lib/errors';
import { AppButton } from '@/components/ui/app-button';

export default function AdminDashboardPage() {
    const { users, ads, loading, errors } = useApp();
    const { showToast } = useToast();
    const [clicks7d, setClicks7d] = useState<{ totalClicks: number; topAds: { adId: string; clicks: number }[] }>({ totalClicks: 0, topAds: [] });
    const [clicksAllTime, setClicksAllTime] = useState(0);

    const sellers = users.filter((u) => u.role === 'seller');
    const approvedSellers = sellers.filter((u) => u.status === 'approved');
    const pendingSellers = sellers.filter((u) => u.status === 'pending');
    const blockedSellers = sellers.filter((u) => u.status === 'blocked' || u.status === 'rejected');
    const publicAds = getPublicAds(ads, users);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const stats = await getCachedClickStatsLast7Days();
                if (cancelled) return;
                setClicks7d({ totalClicks: stats.totalClicks, topAds: stats.topAds.slice(0, 5) });
            } catch (err) {
                if (cancelled) return;
                const message = getMessageForError(err);
                showToast({
                    variant: 'error',
                    title: 'Erro ao carregar estatísticas (7 dias)',
                    description: message,
                });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [showToast]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const stats = await getClicksRepo().getStats();
                if (!cancelled) setClicksAllTime(stats.totalClicks);
            } catch (err) {
                if (cancelled) return;
                const message = getMessageForError(err);
                showToast({
                    variant: 'error',
                    title: 'Erro ao carregar estatísticas (total)',
                    description: message,
                });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [showToast]);

    const stats = [
        { title: 'Vendedores aprovados', value: approvedSellers.length, icon: UserCheck, description: 'Contas ativas' },
        { title: 'Vendedores pendentes', value: pendingSellers.length, icon: Clock, description: 'Aguardando ativação' },
        { title: 'Bloqueados / rejeitados', value: blockedSellers.length, icon: Ban, description: 'Contas inativas' },
        { title: 'Anúncios públicos', value: publicAds.length, icon: Package, description: 'Publicados + dono aprovado' },
        { title: 'Cliques WhatsApp (7 dias)', value: clicks7d.totalClicks, icon: MessageCircle, description: 'Últimos 7 dias' },
        { title: 'Cliques WhatsApp (total)', value: clicksAllTime, icon: MessageCircle, description: 'Desde o início' },
    ];

    const topByClicks = clicks7d.topAds
        .map(({ adId, clicks }) => ({ ad: ads.find((a) => a.id === adId), clicks }))
        .filter((x) => x.ad);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Visão geral</h2>
                    <p className="text-sm text-muted-foreground">Estatísticas gerais da plataforma.</p>
                </div>
                <AppButton variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar
                </AppButton>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {topByClicks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top anúncios por contactos</CardTitle>
                        <p className="text-sm text-muted-foreground">Últimos 7 dias · contactos via WhatsApp</p>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {topByClicks.map(({ ad, clicks }) => (
                                <li key={ad!.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
                                    <span className="font-medium">{ad!.title}</span>
                                    <span className="text-muted-foreground">
                                        {users.find((u) => u.id === ad!.userId)?.name ?? ad!.userId} · {clicks} contactos
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
