# Checklist de Produção – CeluPublic + Supabase

## 1. Variáveis de ambiente (Vercel/Netlify)

- [ ] `VITE_SUPABASE_URL` – URL do projecto Supabase.
- [ ] `VITE_SUPABASE_ANON_KEY` – chave anon do Supabase.
- [ ] `VITE_USE_SUPABASE`:
  - Em produção pode ser omitida (o app assume Supabase por omissão).
  - Ou definir explicitamente `VITE_USE_SUPABASE=true`.

## 2. Migrações (ordem recomendada)

No SQL Editor do Supabase, executar por ordem:

1. `supabase/migrations/20250114000000_create_profiles.sql`
2. `supabase/migrations/20250214000000_create_ads_and_images.sql`
3. `supabase/migrations/20250215000000_create_categories_banners_settings.sql`
4. `supabase/migrations/20250216_profiles_nullable.sql`
5. `supabase/migrations/20250216_create_likes_and_clicks.sql`
6. `supabase/migrations/20250216_fixups.sql`
7. `supabase/migrations/20250216_storage_update_policies.sql`
8. `supabase/migrations/20250216_fix_profiles_rls_no_recursion.sql` ⚠️ **CRÍTICO: Remove recursão infinita nas políticas RLS**
9. `supabase/migrations/20250216_fix_profiles_rls_NO_RECURSION_HARD.sql` ⚠️ **CRÍTICO HARD FIX: Remove recursão infinita (42P17) usando função SECURITY DEFINER que consulta auth.users diretamente**
10. `supabase/migrations/20260217_fix_profiles_rls_NO_RECURSION_HARD.sql` ⚠️ **CRÍTICO HARD FIX v2: Drop ALL policies + helpers seguras (sem `public.profiles` nas policies/funções usadas por elas)**

## 3. Buckets de Storage

Criar buckets em **Storage → New bucket**:

- [ ] `ad-images` (public bucket ON)
- [ ] `banner-images` (public bucket ON)

Políticas (já incluídas em `20250216_fixups.sql`):

- `ad-images`:
  - SELECT público.
  - INSERT/DELETE apenas em pastas cujo primeiro segmento do `name` é `auth.uid()` (utilizador dono).
  - Admin pode fazer upload/delete em qualquer path.
- `banner-images`:
  - SELECT público.
  - INSERT/DELETE apenas para admin.

## 4. Autenticação e perfis

- [ ] Ativar **Email/Password** e **Google** em `Authentication → Providers`.
- [ ] **Configurar URLs no Dashboard do Supabase** (CRÍTICO para OAuth funcionar):

  No Dashboard do Supabase → **Authentication** → **URL Configuration**:

  - **Site URL**: `http://localhost:5173` (dev) ou `https://SEU_DOMINIO` (produção)
  - **Additional Redirect URLs** (adicionar cada uma):
    - `http://localhost:5173/auth/callback` (desenvolvimento local)
    - `https://SEU_DOMINIO/auth/callback` (produção)

  ⚠️ **Sem estas URLs configuradas, o OAuth Google não funciona e fica preso no callback!**

  **Nota importante:** O app usa **PKCE-only** (não suporta Implicit flow). O callback espera receber `?code=` na query string. O Supabase gerencia o fluxo PKCE automaticamente quando `detectSessionInUrl: true` está configurado no client.

- [ ] **Configurar Google Cloud OAuth** (se usar Google OAuth):

  No [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

  1. Vá a **APIs & Services** → **Credentials**
  2. Abra o OAuth 2.0 Client ID usado pelo Supabase
  3. Em **Authorized redirect URIs**, adicione:
     - `https://wuppmtktghypzgbiyldj.supabase.co/auth/v1/callback` (endpoint do Supabase - substitua pelo seu PROJECT_ID)
     - ⚠️ **NÃO** adicione `http://localhost:5173/auth/callback` aqui — o Supabase gerencia isso internamente

  **Nota:** O Supabase usa o seu próprio endpoint (`/auth/v1/callback`) e depois redireciona para o teu `redirectTo`. Por isso, só precisas configurar o endpoint do Supabase no Google Cloud.

  **Importante:** O app usa PKCE (Authorization Code Flow com PKCE), então o Google Cloud deve estar configurado para suportar este fluxo. O endpoint `/auth/v1/callback` do Supabase recebe o `code` do Google e depois redireciona para `http://localhost:5173/auth/callback?code=...`.
- [ ] Confirmar que há tabela `public.profiles` com RLS conforme migração (`create_profiles.sql`).
- [ ] **Promover email admin (case-insensitive)**:

```sql
-- Promote this email to admin (case-insensitive)
update public.profiles
set role = 'admin', status = 'approved'
where lower(email) = lower('sunyldjosesomailamatapa@gmail.com');
```

- [ ] **Garantir profile para admin email (se já existe em auth.users mas não em profiles)**:

```sql
-- Ensure profile exists for admin email (from auth.users) and promote
-- ⚠️ CRÍTICO: Execute isto ANTES de testar login Google
insert into public.profiles (id, full_name, email, role, status, account_type, created_at, updated_at)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.email),
  lower(u.email),
  'admin',
  'approved',
  'seller',
  now(),
  now()
from auth.users u
where lower(u.email) = lower('sunyldjosesomailamatapa@gmail.com')
on conflict (id) do update
set role='admin',
    status='approved',
    email=excluded.email,
    full_name=excluded.full_name,
    updated_at=now();
```

**Nota:** O frontend também promove automaticamente este email para admin ao criar/atualizar perfis (ver `AuthContext.ensureProfileForSupabaseUser`), mas este SQL garante que funciona mesmo se o frontend falhar.

**Validação:** Após executar, roda:
```sql
select id, email, role, status 
from public.profiles 
where lower(email) = lower('sunyldjosesomailamatapa@gmail.com');
```
Deve retornar `role='admin'` e `status='approved'`.

## 5. admin_settings (config pública)

Inserir valores recomendados:

```sql
insert into public.admin_settings (key, value) values
  ('admin_whatsapp', '{"number":"+258840000000"}'::jsonb),
  ('activation_fee_mzn', '{"amount":20}'::jsonb)
on conflict (key) do update set value = excluded.value;
```

## 6. Validação Crítica OAuth (ANTES de testar login)

⚠️ **Execute estes passos ANTES de testar o login Google:**

### 6.1. Verificar Callback URL

Após clicar "Entrar com Google", o callback deve voltar como:
- ✅ `http://localhost:5173/auth/callback?code=...` (com `?code=`)
- ❌ `http://localhost:5173/auth/callback#` (sem `?code=` = configuração errada)

**Se voltar sem `?code=`:**
1. Verifica **Supabase Dashboard → Authentication → URL Configuration**
2. Verifica **Google Cloud → Authorized redirect URIs**

### 6.2. Validar Perfil Admin

No **SQL Editor**, execute:

```sql
select id, email, role, status 
from public.profiles 
where lower(email) = lower('sunyldjosesomailamatapa@gmail.com');
```

**Resultado esperado:**
- `role = admin`
- `status = approved`

Se não aparecer ou estiver diferente, executa novamente o SQL do passo 4 (criação/promoção de admin).

## 7. Testes rápidos end-to-end

1. **Signup / Email**:
   - [ ] Criar conta com email/senha.
   - [ ] Verificar que é redireccionado para `/ativacao` e perfil tem `status='pending'`.
2. **Login Google (Admin)**:
   - [ ] Entrar com Google usando `sunyldjosesomailamatapa@gmail.com`.
   - [ ] Verificar que callback volta com `?code=...`
   - [ ] Confirmar redirecionamento para `/admin`.
3. **Login Google (Novo Utilizador)**:
   - [ ] Entrar com Google usando email novo.
   - [ ] Verificar que callback volta com `?code=...`
   - [ ] Confirmar que é criado/atualizado um row em `public.profiles` com `status='pending'`.
   - [ ] Confirmar redirecionamento para `/ativacao`.
4. **Painel Admin**:
   - [ ] Entrar como admin.
   - [ ] Em `Admin → Utilizadores`, aprovar o vendedor criado.
5. **Fluxo vendedor**:
   - [ ] Vendedor volta a entrar; deve ir para `/vendedor`.
   - [ ] Criar anúncio com até 5 imagens.
   - [ ] Confirmar upload no bucket `ad-images` e linhas em `public.ad_images`.
6. **Marketplace público**:
   - [ ] Home mostra apenas anúncios `status='published'` de donos com `status='approved'`.
   - [ ] Página de detalhe `/anuncio/:id` carrega imagens via URL pública do Storage.
7. **Banners e settings**:
   - [ ] Criar/editar banners em `Admin → Banners`; verificar `public.banners` + Storage `banner-images`.
   - [ ] Confirmar que WhatsApp do admin e taxa de activação vêm de `admin_settings`.

## 7. Verificações finais

- [ ] `npm run build` passa sem erros.
- [ ] `npm run typecheck` passa sem erros.
- [ ] Navegação anónima (Home, Anúncios, Detalhe, Categorias) funciona sem consola com erros.
- [ ] Modo local (`VITE_USE_SUPABASE=false`) continua funcional para desenvolvimento offline (usa localStorage/seed).

