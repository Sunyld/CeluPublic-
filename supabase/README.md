# Supabase (Phase 3 Block A + B)

## Aplicar as migrações

### Opção 1: CLI com .env (link automático pelo project ref)

O project ref é lido de `NEXT_PUBLIC_SUPABASE_URL` no `.env`. Na pasta do projeto:

```powershell
npm run db:push
```

Na primeira vez, o CLI pode pedir a **password da base de dados** (Supabase Dashboard → Project Settings → Database). Ou defina `SUPABASE_ACCESS_TOKEN` no `.env` (token em https://supabase.com/dashboard/account/tokens) para não ser pedido.

### Opção 2: SQL Editor no Dashboard

1. No [Dashboard do Supabase](https://supabase.com/dashboard), abra o projeto.
2. Vá a **SQL Editor** e execute os ficheiros em `migrations/` por ordem (ou apenas a migration que falta, ex.: `20260221_fix_handle_new_user_status.sql`).

### Opção 3: Link manual + db push

```powershell
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

O `SEU_PROJECT_REF` é o subdomínio da URL do projeto (ex.: `https://wuppmtktghypzgbiyldj.supabase.co` → ref = `wuppmtktghypzgbiyldj`).

## Bucket de imagens (Block B)

Criar o bucket para imagens dos anúncios:

1. No dashboard: **Storage** → **New bucket**.
2. Nome: `ad-images`.
3. **Public bucket**: activar (leitura pública para listar e exibir imagens).
4. Criar o bucket.

### Políticas de Storage (RLS no Storage)

- **Leitura pública**: qualquer utilizador pode ler objectos em `ad-images` (já garantido com bucket público).
- **Upload**: apenas utilizadores autenticados podem fazer upload; recomenda-se restringir ao próprio utilizador:
  - **Insert**: `auth.uid()::text = (storage.foldername(name))[1]` — só pode subir em pastas cujo primeiro segmento é o próprio `owner_id`.
- **Admin**: pode subir/eliminar em qualquer pasta (opcional; pode ser feito via políticas custom ou pelo dashboard).

Convenção de paths: `{ownerId}/{adId}/{uuid}.jpg` (ex.: `a1b2c3.../e4f5.../u6.jpg`).

## Bucket de banners (Block C)

1. **Storage** → **New bucket**.
2. Nome: `banner-images`.
3. **Public bucket**: activar (leitura pública).
4. Criar o bucket.

Convenção de paths: `banners/{bannerId}/{uuid}.jpg` (ou `banners/{uuid}.jpg`).

Políticas recomendadas:
- **Leitura**: pública (bucket público).
- **Upload/Delete**: apenas utilizadores com perfil admin (ex.: política que verifica `profiles.role = 'admin'` para auth.uid()).

### Cache (opcional)

No bucket `ad-images`, em **Settings** → **Cache Control**, pode definir headers recomendados, por exemplo:
- `Cache-Control: public, max-age=31536000` para imagens imutáveis (se usar UUID no nome).

## Criar o primeiro admin

Após o primeiro utilizador se registar (ou manualmente inserir um perfil), defina-o como admin no SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'seu-email@exemplo.com';
```

Só contas com `role = 'admin'` podem ver todos os perfis e alterar `status`/`role` na área de administração.

## Variáveis de ambiente

Em `.env` (não commitar chaves reais):

- `VITE_SUPABASE_URL` – URL do projeto
- `VITE_SUPABASE_ANON_KEY` – chave anon
- `VITE_USE_SUPABASE=true` – ativa Auth + perfis em Supabase; `false` mantém apenas localStorage

## Configuração de OAuth (Google)

Para que o login com Google funcione, configure no Dashboard do Supabase:

1. **Authentication** → **Providers** → **Google**: Enabled ✅
2. **Authentication** → **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (dev) ou `https://SEU_DOMINIO` (produção)
   - **Additional Redirect URLs**: adicionar:
     - `http://localhost:5173/auth/callback` (desenvolvimento)
     - `https://SEU_DOMINIO/auth/callback` (produção)

⚠️ **Sem estas URLs configuradas, o OAuth Google não funciona e fica preso no callback `/auth/callback`!**

## Checklist de produção (Supabase)

- Verificar que **nenhuma** chave de serviço (service role) é exposta no frontend.
- Rever políticas RLS para `profiles`, `ads`, `ad_images`, `categories`, `banners` e `admin_settings`.
- Confirmar que buckets `ad-images` e `banner-images`:
  - só permitem upload/delete a utilizadores autenticados (e admin, no caso de banners).
  - têm cabeçalhos de cache adequados (`Cache-Control` longo para imagens estáticas).
- Criar manualmente pelo menos uma conta com `role = 'admin'` em `public.profiles`.
- Definir `admin_whatsapp` e `activation_fee_mzn` em `public.admin_settings` para uso no frontend.
