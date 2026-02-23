# Auditoria BD — CeluPublic (React/Vite + Supabase)

## TAREFA 0 — Resultado da auditoria

### 1) Tabelas e colunas usadas no código (via `.from()` / repos)

| Tabela | Repo/uso | Colunas referenciadas |
|--------|----------|------------------------|
| **profiles** | usersRepo.supabase.ts | id, full_name, email, whatsapp, province, city, role, status, account_type, created_at, updated_at |
| **ads** | adsRepo.supabase.ts | id, owner_id, type, status, title, description, price_mzn, price_note, province, city, neighborhood, category, whatsapp, created_at, updated_at |
| **ad_images** | adsRepo.supabase.ts | ad_id, path, sort_order (e id para delete) |
| **banners** | bannersRepo.supabase.ts | id, title, image_path, link, active, sort_order, created_at |
| **categories** | categoriesRepo.supabase.ts | id, name, slug, icon, created_at |
| **admin_settings** | settingsRepo.supabase.ts | key, value, updated_at |
| **ad_clicks** | clicksRepo.supabase.ts | ad_id, user_id, type |
| **ad_likes** | likesRepo.supabase.ts | ad_id, user_id, created_at (PK composta) |
| **ad_like_counts** | likesRepo.supabase.ts | view: ad_id, likes_count |
| **ad_click_counts_all** | clicksRepo.supabase.ts | view: ad_id, clicks_total, clicks_7d |
| **ad_click_counts_7d** | clicksRepo.supabase.ts | view: ad_id, clicks_total, clicks_7d |
| **seller_requests** | app/admin/solicitacoes (Next) e API profile/ensure | user_id, status, payment_*, reviewed_* — tabela usada em outro app; no Vite precisamos suportar o mesmo fluxo (admin vê pedidos, aprova; user cria 1 por user) |

### 2) Buckets usados

- **banner-images**: leitura pública no código (listPublic/listAll); escrita no create/update de banner (path `banners/<bannerId>/<uuid>.<ext>`).
- **ad-images**: leitura/escrita por owner e admin; path `<userId>/<adId>/<uuid>.<ext>`.

### 3) Rotas /api/* que escrevem em BD

- No projeto **React/Vite** não há rotas API no mesmo repo (tudo via Supabase client).
- No projeto **Next.js** (outro repo referenciado no grep): `app/api/profile/ensure/route.ts`, `app/admin/solicitacoes` usam `seller_requests` e profiles.

Para o app Vite: criação de profile é feita no **client** via `usersRepo.create()` (Supabase), portanto RLS deve permitir INSERT do próprio perfil (auth.uid() = id).

### 4) Pontos de criação automática de profile (ensure)

- **AuthContext** e **AuthCallback**: após login OAuth ou email, chamam `repo.create()` ou `ensureProfileOnce()` que faz getById + create. Ou seja: criação de profile no client com `profiles` insert (auth.uid() = id).
- Não há trigger obrigatório em auth.users para criar profile; o app cria no primeiro acesso. Opcional: trigger `handle_new_user` pode ser usado para criar profile ao signup (evitando dependência do client).

### 5) Páginas admin que listam solicitações/usuários/banners

- Admin lista **usuários** (profiles) — usersRepo.list().
- Admin lista **banners** — bannersRepo.listAll().
- Admin lista **anúncios** — adsRepo.list().
- Admin **solicitações** (seller_requests): no código Next.js existe; no Vite pode ser implementado listando seller_requests com RLS “admin vê tudo”.
- Admin **categorias** — categoriesRepo.list() + create/update/delete.
- Admin **configurações** — admin_settings (settingsRepo).

### 6) Inconsistências detectadas

1. **RLS recursivo (42P17)**: Várias migrations antigas usam `exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')` nas policies de profiles, ads, banners, etc. Isso causa recursão. **Solução**: usar apenas `public.is_admin(auth.uid())` (função SECURITY DEFINER que lê auth.users).
2. **Duas migrações diferentes para seller_requests**: `20260220_create_seller_requests.sql` (user_id → auth.users) e `20260220_seller_requests.sql` (user_id → profiles, status pending_review/approved/rejected). Unificar num único schema: user_id UUID UNIQUE ref auth.users, status pending/approved/rejected, amount_mzn, payment_*, reviewed_by, reviewed_at.
3. **profiles.full_name** no BD vs **User.name** no tipo: já mapeado nos repos (full_name ↔ name).
4. **Views ad_click_counts_***: o front espera colunas `ad_id`, `clicks_total`, `clicks_7d` em ambas as views (uma tem clicks_total, outra clicks_7d; a migration 20260220 já expõe as duas colunas com null onde não aplica).
5. **Storage policies** em storage.objects: no SQL Editor pode dar "must be owner of table objects". Solução: guia manual no Dashboard (STORAGE_POLICIES_MANUAL.md).
6. **Constantes de contacto**: já corretas em `lib/constants.ts`: WhatsApp +258 87 833 0517, Email celupublic@gmail.com. admin_settings pode ter admin_whatsapp, support_email, activation_fee_mzn.

---

## Resumo para o plano de schema

- **profiles**: id (PK, ref auth.users), full_name, email, whatsapp, province, city, role, status, account_type, created_at, updated_at. Constraints: role in ('admin','seller'), status in ('pending','approved','rejected','blocked','suspended').
- **seller_requests**: id, user_id (UNIQUE, ref auth.users), status (pending/approved/rejected), amount_mzn, payment_method, payment_reference, reviewed_by, reviewed_at, note, created_at, updated_at.
- **ads**: id, owner_id (ref profiles), type, status, title, description, price_mzn, price_note, province, city, neighborhood, category, whatsapp, created_at, updated_at.
- **ad_images**: id, ad_id, path, sort_order, created_at.
- **banners**: id, title, image_path, link, active, sort_order, created_at.
- **categories**: id, name, slug, icon, created_at.
- **admin_settings**: id, key UNIQUE, value jsonb, updated_at.
- **ad_clicks**: id, ad_id, type, user_id (nullable), created_at, ip_hash (opcional).
- **ad_likes**: (ad_id, user_id) PK, created_at.
- **Views**: ad_like_counts, ad_click_counts_all, ad_click_counts_7d (com colunas ad_id, clicks_total, clicks_7d onde aplicável).
