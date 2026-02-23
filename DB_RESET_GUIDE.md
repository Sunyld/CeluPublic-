# DB Reset Guide — CeluPublic (Supabase)

Guia para limpar e recriar o banco e validar o sistema após aplicar as migrations.

---

## 1. Ordem de execução das migrations

Execute **no Supabase SQL Editor** na ordem abaixo (cada bloco é um ficheiro em `supabase/migrations/`):

| # | Ficheiro | Descrição |
|---|----------|-----------|
| 1 | `0001_extensions.sql` | Extensions (uuid-ossp, pgcrypto) |
| 2 | `0002_functions.sql` | Funções `is_admin`, `is_admin_by_email`, `set_updated_at` |
| 3 | `0003_tables.sql` | Tabelas (profiles, seller_requests, ads, ad_images, banners, categories, admin_settings, ad_clicks, ad_likes) + views |
| 4 | `0004_rls_policies.sql` | RLS em todas as tabelas (usa `public.is_admin(auth.uid())`) |
| 5 | `0005_storage.sql` | Buckets `ad-images` e `banner-images` |
| 6 | `0006_seed_admin.sql` | Perfil admin (email celupublic@gmail.com) + admin_settings |
| 7 | `0007_normalize_paths.sql` | (Opcional) Normalizar paths em banners e ad_images |

**Importante:** Se ao rodar algo em `storage.objects` aparecer **"must be owner of table objects"**, ignore esse passo e configure as policies de Storage pelo Dashboard conforme `supabase/STORAGE_POLICIES_MANUAL.md`.

---

## 2. Checklist “limpar e recriar”

1. Fazer backup dos dados se precisar (export ou dump).
2. No SQL Editor, executar cada migration **na ordem** (1 → 7).
3. Se usar apenas SQL (sem CLI), não é necessário “reverter” — as migrations usam `DROP ... IF EXISTS` e depois `CREATE`, ou seja, são idempotentes.
4. Após 0006, conferir:
   - Um perfil com email `celupublic@gmail.com` e `role = 'admin'`, `status = 'approved'` (se esse user já existir em `auth.users`).
   - Linhas em `admin_settings` para `admin_whatsapp`, `support_email`, `activation_fee_mzn`.
5. Storage: se 0005 não criou policies em `storage.objects`, seguir `STORAGE_POLICIES_MANUAL.md` no Dashboard.

---

## 3. Queries de auditoria

### Listar policies por tabela

```sql
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

### Testar `is_admin(uid)`

Substitua `'SEU_USER_ID'` pelo UUID do utilizador que tem email admin (ex.: celupublic@gmail.com):

```sql
select public.is_admin('SEU_USER_ID'::uuid);
-- esperado: true para o admin, false para outros.
```

### Inserir banner como admin

(Com sessão autenticada como admin no app, ou em teste via Service Role.)

- No app: ir a Admin → Banners → criar banner com imagem.  
- Ou via SQL (apenas para teste; o path deve existir no Storage):

```sql
insert into public.banners (title, image_path, active, sort_order)
values ('Teste', 'banners/00000000-0000-0000-0000-000000000001/test.jpg', true, 0);
```

### Inserir ad como user

- No app: login como vendedor aprovado → Vendedor → Novo anúncio.  
- Ou (com RLS a permitir): criar perfil aprovado e depois criar ad com `owner_id` = esse perfil.

### Ver seller_requests pendentes (admin)

```sql
select sr.id, sr.user_id, sr.status, sr.amount_mzn, sr.payment_reference, sr.created_at
from public.seller_requests sr
where sr.status = 'pending'
order by sr.created_at desc;
```

(Só visível para quem passa em `public.is_admin(auth.uid())`.)

### Verificar paths normalizados (após 0007)

```sql
-- Nenhum registo deve ter URL completa em image_path
select count(*) as banners_with_url from public.banners where image_path like 'http%';

-- Nenhum registo deve ter URL completa em path
select count(*) as ad_images_with_url from public.ad_images where path like 'http%';
```

Esperado: 0 em ambos (após normalização).

---

## 4. Checklist de testes do app

- [ ] **Auth**: Login (email e Google) cria/atualiza perfil sem erro 42501/42P17.
- [ ] **Redirect**: Após login, redirecionamento para /admin (admin), /vendedor (vendedor aprovado) ou /ativacao (pendente).
- [ ] **Admin**:
  - [ ] Listar usuários (profiles).
  - [ ] Listar e criar/editar banners (upload em `banner-images`).
  - [ ] Listar e aprovar/rejeitar solicitações (seller_requests) se a UI existir.
  - [ ] Listar anúncios e categorias.
- [ ] **Vendedor aprovado**:
  - [ ] Criar/editar anúncio com imagens (upload em `ad-images`, path `userId/adId/...`).
  - [ ] Ver seus anúncios.
- [ ] **Público**:
  - [ ] Ver listagem de anúncios publicados (apenas de vendedores aprovados).
  - [ ] Ver detalhe de anúncio e imagens.
  - [ ] Ver banners ativos e categorias.
- [ ] **Likes/Cliques**: Registar like e clique (WhatsApp) sem erro; views `ad_click_counts_*` e `ad_like_counts` retornam dados.

---

## 5. Contactos do projeto (constantes)

- **WhatsApp admin**: +258 87 833 0517  
- **Email suporte**: celupublic@gmail.com  

Estes valores estão em `lib/constants.ts` (CONTACT_INFO) e em `admin_settings` (admin_whatsapp, support_email). O admin do sistema (RLS) é determinado pela função `public.is_admin(auth.uid())`, que usa o email **celupublic@gmail.com** (definido em `0002_functions.sql`). Para outro email admin, altere essa função.
