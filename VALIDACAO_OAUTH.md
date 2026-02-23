# Validação Rápida OAuth Google + Admin Setup

## ⚠️ CRÍTICO: Ordem de Execução

Execute estes passos **por ordem** antes de testar o login Google.

---

## 1. Verificar que o callback volta com `?code=...`

### ✅ Configuração Supabase Dashboard

No **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL**: `http://localhost:5173`
- **Additional Redirect URLs** (adicionar):
  - `http://localhost:5173/auth/callback`

⚠️ **Sem isto, o callback volta como `/auth/callback#` (sem `?code=`) e o login falha.**

### ✅ Configuração Google Cloud OAuth

No **Google Cloud Console → APIs & Services → Credentials**:

1. Abra o OAuth 2.0 Client ID usado pelo Supabase
2. Em **Authorized redirect URIs**, adicione:
   - `https://wuppmtktghypzgbiyldj.supabase.co/auth/v1/callback`

⚠️ **NÃO adicione `localhost/auth/callback` aqui** — só o endpoint do Supabase.

---

## 2. Aplicar Migração Crítica (RLS Recursion)

No **Supabase SQL Editor**, execute:

```sql
-- Arquivo: supabase/migrations/20250216_fix_profiles_rls_no_recursion.sql
```

Esta migração **remove a recursão infinita** nas políticas RLS que impede login e criação de perfil.

**Se não aplicares esta migração, vais ter erro:**
```
infinite recursion detected in policy for relation "profiles"
```

---

## 3. Criar/Promover Admin por SQL (Garantia Total)

No **Supabase SQL Editor**, execute:

```sql
-- Ensure profile exists for admin email (from auth.users) and promote
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

Isso garante:
- ✅ Se já existe em `auth.users`, cria/atualiza o `profiles`
- ✅ Fica **admin + approved** sem depender do frontend

---

## 4. Validação Rápida (2 Queries)

No **Supabase SQL Editor**, execute:

```sql
-- Verificar perfil admin
select id, email, role, status 
from public.profiles 
where lower(email) = lower('sunyldjosesomailamatapa@gmail.com');
```

**Resultado esperado:**
- `role = admin`
- `status = approved`

Se não aparecer ou estiver diferente, executa novamente o passo 3.

---

## 5. Teste de Login

### ✅ Login Google com email admin (`sunyldjosesomailamatapa@gmail.com`)

**Comportamento esperado:**
1. Clica "Entrar com Google"
2. Seleciona conta Google
3. Volta para: `http://localhost:5173/auth/callback?code=...` ✅
4. Redireciona para: **`/admin`** ✅

### ✅ Login Google com email novo (não aprovado)

**Comportamento esperado:**
1. Clica "Entrar com Google"
2. Seleciona conta Google
3. Volta para: `http://localhost:5173/auth/callback?code=...` ✅
4. Cria perfil com `status='pending'`
5. Redireciona para: **`/ativacao`** ✅

---

## Troubleshooting

### ❌ Callback volta como `/auth/callback#` (sem `?code=`)

**Causa:** URLs não configuradas corretamente.

**Solução:**
1. Verifica **Supabase Dashboard → Authentication → URL Configuration**
2. Verifica **Google Cloud → Authorized redirect URIs**
3. Confirma que o endpoint do Supabase está no Google Cloud

### ❌ Erro "infinite recursion detected in policy"

**Causa:** Migração `20250216_fix_profiles_rls_no_recursion.sql` não aplicada.

**Solução:** Aplica a migração no SQL Editor.

### ❌ Login admin não vai para `/admin`

**Causa:** Perfil não está como `admin` + `approved`.

**Solução:** Executa o passo 3 (SQL de criação/promoção de admin).

### ❌ Callback fica preso em loader infinito

**Causa:** Código não está a receber `?code=` ou há erro no `exchangeCodeForSession`.

**Solução:**
1. Abre DevTools → Console
2. Verifica logs `[AUTH_CALLBACK]`
3. Se não aparecer `?code=`, verifica configurações do passo 1
4. Se aparecer erro no `exchangeCodeForSession`, verifica migrações aplicadas

---

## Checklist Rápido

- [ ] Supabase: Site URL = `http://localhost:5173`
- [ ] Supabase: Additional Redirect URLs inclui `http://localhost:5173/auth/callback`
- [ ] Google Cloud: Authorized redirect URIs inclui `https://wuppmtktghypzgbiyldj.supabase.co/auth/v1/callback`
- [ ] Migração `20250216_fix_profiles_rls_no_recursion.sql` aplicada
- [ ] SQL de criação/promoção de admin executado
- [ ] Query de validação mostra `role='admin'` e `status='approved'`
- [ ] Login Google com admin redireciona para `/admin`
- [ ] Login Google com email novo redireciona para `/ativacao`
