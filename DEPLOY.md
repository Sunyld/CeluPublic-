## Deploy do CeluPublic

### 1. Vercel (ou Netlify)

**Build**

- Comando de build: `npm run build`
- Diretório de output: `dist`

**Variáveis de ambiente**

Definir no painel do Vercel/Netlify:

- `VITE_SUPABASE_URL` – URL do projecto Supabase
- `VITE_SUPABASE_ANON_KEY` – chave `anon` (NUNCA usar a service role aqui)
- `VITE_USE_SUPABASE` – `true` em produção para usar Supabase (Auth, perfis, anúncios, etc.)

**Passos gerais**

1. Fazer deploy do repositório para o Vercel/Netlify.
2. Configurar as variáveis de ambiente acima.
3. Confirmar que o comando `npm run build` corre sem erros.
4. Verificar no preview:
   - Navegação anónima (Home, Anúncios, Detalhe)
   - Login/Signup
   - Dashboard vendedor e admin (quando aplicável)

### 2. Supabase

**Migrações**

No painel do Supabase (SQL Editor) ou via CLI:

1. Executar as migrações por ordem:
   - `supabase/migrations/20250114000000_create_profiles.sql`
   - `supabase/migrations/20250214000000_create_ads_and_images.sql`
   - `supabase/migrations/20250215000000_create_categories_banners_settings.sql`

**Buckets de Storage**

Criar buckets:

- `ad-images` – imagens de anúncios
- `banner-images` – imagens de banners

Certificar:

- Buckets com leitura pública (para servir imagens).
- Políticas de upload restritas a utilizadores autenticados (e, no caso de banners, apenas admin).

**RLS e contas admin**

- Verificar políticas RLS para:
  - `profiles`
  - `ads` e `ad_images`
  - `categories`, `banners`, `admin_settings`
- Criar/atribuir manualmente pelo menos uma conta com `role = 'admin'` na tabela `profiles`.
- Inserir em `admin_settings` (via SQL):
  - `admin_whatsapp` (ex. `{ \"number\": \"+25884...\" }`)
  - `activation_fee_mzn` (ex. `{ \"amount\": 20 }`)

### 3. Checklist de produção

- [ ] `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configurados correctamente.
- [ ] Nenhuma chave service role exposta no frontend.
- [ ] Buckets `ad-images` e `banner-images` com políticas de leitura e escrita apropriadas.
- [ ] Migrações aplicadas sem erros.
- [ ] Pelo menos um utilizador admin configurado em `profiles`.
- [ ] Definidos `admin_whatsapp` e `activation_fee_mzn` em `admin_settings`.
- [ ] Navegação anónima a funcionar (Home, Anúncios, Detalhe).
- [ ] Modo local (`VITE_USE_SUPABASE=false`) ainda funciona para desenvolvimento offline.

