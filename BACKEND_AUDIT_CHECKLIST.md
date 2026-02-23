# CeluPublic — Backend Audit Checklist

## Tabelas e schema

### Queries de auditoria (rodar no Supabase SQL Editor)

```sql
-- 1) Tabelas existem?
SELECT to_regclass('public.profiles') AS profiles_exists;
SELECT to_regclass('public.seller_requests') AS seller_requests_exists;
SELECT to_regclass('public.ads') AS ads_exists;
SELECT to_regclass('public.ad_images') AS ad_images_exists;
SELECT to_regclass('public.banners') AS banners_exists;
SELECT to_regclass('public.categories') AS categories_exists;
SELECT to_regclass('public.admin_settings') AS admin_settings_exists;

-- 2) Contagens
SELECT 'profiles' AS tbl, COUNT(*) FROM public.profiles
UNION ALL SELECT 'seller_requests', COUNT(*) FROM public.seller_requests
UNION ALL SELECT 'ads', COUNT(*) FROM public.ads
UNION ALL SELECT 'banners', COUNT(*) FROM public.banners;

-- 3) seller_requests por status
SELECT status, COUNT(*) FROM public.seller_requests GROUP BY status;

-- 4) profiles pendentes com/sem seller_request
SELECT 
  p.id, p.email, p.status, p.role, 
  sr.id AS request_id, sr.status AS request_status
FROM public.profiles p
LEFT JOIN public.seller_requests sr ON sr.user_id = p.id
WHERE p.status = 'pending' AND (p.role IS NULL OR p.role != 'admin')
ORDER BY p.created_at DESC
LIMIT 20;

-- 5) Policies por tabela
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6) Trigger ensure_seller_request
SELECT tgname, tgrelid::regclass, tgenabled
FROM pg_trigger
WHERE tgname = 'tr_ensure_seller_request';

-- 7) is_admin
SELECT public.is_admin(auth.uid()) AS is_admin_check;
```

## Rotas API (server-side)

| Rota | Método | Uso | Service Role |
|------|--------|-----|--------------|
| `/api/profile/ensure` | POST | Garantir profile + seller_request | Sim |
| `/api/admin/solicitacoes` | GET | Listar solicitações | Sim |
| `/api/admin/solicitacoes/approve` | POST | Aprovar solicitação | Sim |
| `/api/admin/solicitacoes/reject` | POST | Rejeitar solicitação | Sim |
| `/api/admin/banners` | GET | Listar banners (admin) | Sim |
| `/api/admin/banners` | POST | Upload banner | Sim |
| `/api/admin/banners` | PATCH | Atualizar banner | Sim |
| `/api/admin/banners/[id]` | DELETE | Remover banner (row + storage) | Sim |

## Fluxos de teste

### 1. Solicitações
- [ ] Criar conta nova (Google/email) → profile criado com status=pending
- [ ] Verificar: `SELECT * FROM seller_requests WHERE user_id = '<id>'` → 1 row
- [ ] Admin em /admin/solicitacoes → vê o pedido
- [ ] Aprovar → request some da lista, profile.status='approved'
- [ ] Usuário relogar → entra em /vendedor (não em ativação)
- [ ] Rejeitar (outro user) → request some, profile.status='rejected'
- [ ] Usuário rejeitado → vê tela de rejeição

### 2. Banners
- [ ] Admin adiciona banner → aparece na lista
- [ ] Admin remove banner → some imediatamente da lista
- [ ] Verificar: storage object removido (sem 404/400 na imagem)
- [ ] Site público: banners ativos carregam sem erro

### 3. Ads
- [ ] Vendedor aprovado cria ad → publica
- [ ] Ad aparece no marketplace
- [ ] Imagens carregam (sem 400)

## Logs server-side esperados

```
[API/PROFILE/ENSURE] Seller request ensured SUCCESS: { userId, requestId }
[API/ADMIN/SOLICITACOES] Returning requests: N
[API/ADMIN/APPROVE] OK requestId: ... userId: ...
[API/ADMIN/REJECT] OK requestId: ... userId: ...
[API/ADMIN/BANNERS] Deleted banner: <id> path: <path>
```

## Migrations a aplicar

1. `20260222_fix_ad_click_counts_views.sql` — views de cliques
2. `20260223_fix_seller_requests_creation.sql` — seller_requests + trigger + backfill
3. Buckets: `banner-images`, `ad-images` (públicos)

## Cache e revalidação

- `GET /api/admin/banners` e `GET /api/admin/solicitacoes`: uso de `cache: 'no-store'` no fetch
- Após delete de banner: remoção imediata no estado local + `loadAll()` para refetch
- Sem `router.refresh()` necessário (página é client component)
