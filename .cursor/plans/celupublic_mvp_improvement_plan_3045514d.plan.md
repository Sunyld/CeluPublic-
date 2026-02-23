---
name: CeluPublic MVP Improvement Plan
overview: Plano estruturado para melhorar UI/UX, completar lógica de negócio, reduzir dívida técnica e preparar a integração com Supabase no MVP CeluPublic (Vite + React + TS + Tailwind v4 + shadcn/ui).
todos: []
isProject: false
---

# Plano de Melhoria CeluPublic MVP

## 1. Resumo do estado actual

### Rotas e layouts

- **Público** (`[Layout](src/components/layout/Layout.tsx)`): Header + main + Footer. Rotas: `/`, `/entrar`, `/cadastro`, `/ativacao`, `/categorias`, `/anuncios`, `/anuncio/:id`, `/termos`. `/pendente` redireciona para `/ativacao`.
- **Admin** (`[ProtectedRoute requireAdmin](src/App.tsx)` + `[AdminLayout](src/components/admin/AdminLayout.tsx)`): Sem header/footer do site; sidebar + conteúdo em `/admin`, `/admin/usuarios`, `/admin/anuncios`, `/admin/categorias`, `/admin/banners`.
- **Vendedor** (`[ProtectedRoute requireApprovedSeller](src/App.tsx)` + `[SellerLayout](src/components/seller/SellerLayout.tsx)`): Shell dashboard em `/vendedor`, `/vendedor/anuncios`, `/vendedor/novo`, `/vendedor/editar/:id`, `/vendedor/definicoes`.

### Auth e portas

- `[AuthContext](src/context/AuthContext.tsx)`: `userId` em estado + localStorage; `user` derivado da lista `users` do AppContext. `login` retorna `User | null`; redirect pós-login em `[Login.tsx](src/pages/Login.tsx)` por `getRedirectPath(user)` (pending/rejected/blocked → `/ativacao`, admin → `/admin`, aprovado → `/vendedor`). Quem aterra em `/entrar` já logado é redirecionado pelo mesmo critério.
- `[ProtectedRoute](src/components/ProtectedRoute.tsx)`: Sem user → `/entrar`; requireAdmin sem ser admin → `/`; requireApprovedSeller sem ser aprovado → `/ativacao`; requirePending só para fluxo de ativação.

### Dados e persistência

- Estado em `[AppContext](src/context/AppContext.tsx)`: `ads`, `categories`, `banners`, `users`, `likedIds`; persistidos via `[storage](src/lib/storage.ts)` (localStorage). **AppContext não usa a camada de repositórios**; as páginas e formulários chamam `setAds`, `setUsers`, etc., directamente.
- Repositórios: interfaces em `[adsRepo.ts](src/lib/repositories/adsRepo.ts)`, `[usersRepo.ts](src/lib/repositories/usersRepo.ts)`, `[bannersRepo.ts](src/lib/repositories/bannersRepo.ts)`; implementação local em `local/*` (adsRepo.local usa `[cache](src/lib/cache.ts)` apenas para `invalidatePrefix`; `getCache`/`setCache` não são usados pelo AppContext). Stubs Supabase em `supabase/*` (não implementados).
- Seed: `[seedIfEmpty](src/lib/seed.ts)` corre no mount do App; cria admin, vendedor demo, categorias, banners e anúncios de exemplo se storage vazio.

### Modelo de anúncio e listagens

- `[Ad](src/types/index.ts)`: `title`, `description`, `price`, `priceOnRequest`, `location` (cidade), `neighborhood?`, `categoryId`, `images[]`, `whatsapp`, `type` (product|service), `likes`, `userId`, `userName?`, `published`, `createdAt`, `updatedAt`. **Não existe campo `province` no Ad**; a província é escolhida no formulário e usada só para derivar lista de cidades (guardamos só cidade em `location`).
- `getPublishedAds()`: filtra `a.published` e ordena por `updatedAt`. **Não filtra por estado do dono** (vendedor bloqueado/rejeitado continuaria a ver os seus anúncios no público se estivessem publicados).
- Home: `[Banner](src/components/marketplace/banner.tsx)` → pills de categoria/tipo → grid de anúncios filtrados; secção "Mais curtidos" com `getTopRankedAds()`.
- `[AdListing](src/pages/AdListing.tsx)`: filtros por `categoria`, `tipo`, `local` (query string); `local` é comparado com `ad.location` (cidade). Não há filtro por província na listagem.

### Imagens e WhatsApp

- `[imageCompression](src/lib/imageCompression.ts)`: redimensiona até 1280px, qualidade 0.8, devolve data URL JPEG. Usado em AdForm; imagens guardadas em base64 no estado/localStorage.
- WhatsApp: `[buildWhatsAppMessage](src/lib/whatsapp.ts)` + `buildWhatsAppHref` + `buildWhatsAppUrl(ad, categoryName)`; mensagem rica por tipo (produto/serviço). Usado em `[AdDetail](src/pages/AdDetail.tsx)` (CTA "Contactar via WhatsApp") e em `[AdCard](src/components/ads/AdCard.tsx)`. O `[MarketplaceAdCard](src/components/marketplace/ad-card.tsx)` recebe `whatsappHref` mas **não mostra link directo para WhatsApp** no card, apenas "Ver detalhes →" para a página do anúncio.

### Header/Footer vs dashboard

- **Site**: `[Header](src/components/layout/Header.tsx)`: logo, Entrar (destaque) / menu utilizador (Meu painel, Ativar conta se pending, Sair), Ajuda (→/termos), Anunciar (→/cadastro). `[Footer](src/components/layout/Footer.tsx)`: links Sobre, Termos, Privacidade, Para Vendedores, Explorar, Contacto (WhatsApp admin, email).
- **Dashboard**: `[DashboardLayout](src/components/dashboard/DashboardLayout.tsx)`: sidebar (logo, nav, user + Sair), header com título da secção e "Ver site →"; drawer no mobile. Admin e Seller usam este shell sem Header/Footer do site.

---

## 2. Auditoria UI/UX (prioridade)

### P0 (obrigatório / bloqueia uso)

- **Anúncios de vendedores bloqueados/rejeitados visíveis no marketplace**: `getPublishedAds()` e helpers não excluem ads cujo `userId` tem `status !== 'approved'`. Corrigir: filtrar por utilizadores aprovados (ou esconder ads de blocked/rejected).
- **Ajuda no Header aponta para Termos**: "Ajuda" vai para `/termos`; idealmente página ou secção dedicada (Como funciona / FAQ) ou manter mas com copy claro.
- **Confirmações destrutivas com `window.confirm**`: Exclusão de anúncio e de banner usam `confirm()`; substituir por modal (Dialog) para consistência e acessibilidade.

### P1 (alto valor)

- **Listagem de anúncios**: Não há skeleton/loading; empty state existe mas copy genérico ("Nenhum anúncio encontrado"). Melhorar empty states com mensagens úteis e CTA (ex.: "Ajuste os filtros" ou "Seja o primeiro a anunciar nesta categoria").
- **Filtro por local**: AdListing usa `local` como texto livre; seria mais claro select de província + cidade (ou manter texto com placeholder "Cidade ou província"). Ad não tem `province`; filtrar por cidade apenas ou adicionar province ao modelo.
- **Card no marketplace**: O botão WhatsApp não aparece no card; só "Ver detalhes". Opção: adicionar ícone/link "Contactar" (WhatsApp) no card para reduzir um clique.
- **Formulário de anúncio**: Sem indicador de "A guardar..." durante submit; feedback de sucesso é apenas navegação. Adicionar loading no submit e opcionalmente toast ou mensagem de sucesso.
- **Página de detalhe**: Galeria sem gestos (swipe) no mobile; thumbnails funcionam. Considerar indicador de posição (ex.: "2/5") e teclado (setas) para acessibilidade.
- **Dashboard vendedor**: SellerDashboard e SellerAdsList usam cores hardcoded (`text-slate-800`, `border-slate-200`); alinhar com design system (tokens de cor) para tema consistente.
- **Activation**: Estado "suspended" não tem UI dedicada (fica como pendente ou bloqueado); tratar explicitamente se o negócio usar esse estado.

### P2 (polimento)

- **Home**: Secção "Mais curtidos" repete estilo do grid principal; garantir hierarquia visual (título de secção, espaçamento). Banner sem imagens activas devolve `null`; fallback opcional (placeholder ou secção escondida).
- **Tipografia e espaçamento**: Revisar escala de títulos (h1/h2) e espaçamento entre secções (ex.: `mt-10`, `mt-20`) para consistência.
- **Acessibilidade**: Garantir focus visível em botões e links; labels em ícones (aria-label já usados em vários); contraste em badges e estados.
- **Footer**: "Sobre", "Como funciona", "Termos", "Privacidade" vão todos para `/termos`; separar ou usar âncoras e microcopy específico.
- **Remover "AI feel"**: Revisar textos genéricos (placeholders, empty states, mensagens de erro); usar tom local (Moçambique) e microcopy concreto.

---

## 3. Lacunas de lógica de negócio

- **Anúncios de vendedores bloqueados/rejeitados**: Esconder do marketplace. Opção: em `getPublishedAds`, `getAdsByCategory`, `getFeaturedAds`, `getTopRankedAds`, `getRelatedAds`, filtrar ads cujo `users.find(u => u.id === ad.userId)?.status === 'approved'` (ou manter lista de userIds aprovados em memo). **Critério de aceite**: Anúncios de utilizadores não aprovados não aparecem em listagens públicas.
- **Ciclo de vida do vendedor**: Transições pending → approved/rejected/blocked existem no Admin (AdminUsers). Bloqueado: login falha; rejeitado: mostra tela em Activation. **Falta**: ao bloquear, esconder ou despublicar anúncios (ou só esconder por filtro como acima).
- **Rascunho vs publicado**: Ad tem `published`; no AdForm novo anúncio é criado sempre com `published: true`. Não há opção "Guardar como rascunho". **Critério**: Definir se MVP permite rascunhos; se sim, botão "Publicar" vs "Guardar rascunho" e listagens públicas só com `published === true` (já é o caso).
- **Limites 10 produtos / 5 serviços**: Aplicados no AdForm (criar e editar ao mudar tipo). SellerDashboard e SellerAdsList mostram contagem. **Critério**: Bloquear criação quando no limite; mensagem clara; consistente em novo e edição.
- **Likes**: Por dispositivo (localStorage); sem limite por utilizador; sem sync com backend. **Aceitar** como MVP; documentar que com Supabase poderá haver tabela `likes` e eventual limite/anti-abuse.
- **WhatsApp**: Usa `ad.whatsapp` (número do anúncio/vendedor); mensagem construída em `whatsapp.ts`. Confirmar que em anúncios criados pelo vendedor o número é o do perfil ou o do anúncio (actualmente campo no formulário do anúncio).
- **Localização**: Signup tem província; anúncio tem cidade (e bairro). Ad não guarda província; derivação cidade→província existe em AdForm (getProvinceForCity) para preencher o select. **Consistência**: Manter cidade como principal na listagem; filtro por província exigiria adicionar `province` ao Ad ou filtrar por cidades da província.
- **Banners**: Ordenação por `order`; active/inactive; Admin pode adicionar (data URL), desactivar, apagar. Sem fallback quando não há banners activos (Banner retorna null). **Critério**: Pelo menos um banner placeholder ou secção oculta quando 0 activos.
- **Admin**: Apenas utilizadores com `role === 'admin'` acedem a `/admin`. ProtectedRoute e Login já encaminham. Sem auditoria de acções; sem limite de admins.

---

## 4. Dívida técnica e arquitectura

- **Repositórios não usados pelo AppContext**: Toda a leitura/escrita passa por `storage` e `setAds`/`setUsers`/etc. A camada repo (local) existe e é usada apenas indirectamente pelo adsRepo.local (que escreve em storage). **Recomendação**: Manter estado no AppContext; na fase Supabase, introduzir adaptador que lê/escreve via repo (Supabase) e mantém interface idêntica (ex.: `loadAds()`, `saveAd()` chamados pelo contexto ou por um hook).
- **Cache**: Apenas `invalidatePrefix` é usado (adsRepo.local). `getCache`/`setCache` não são usados. Ou passar a usar cache para listas (TTL) na camada repo, ou remover get/set se não forem necessários.
- **Duplicação / consistência**: SellerDashboard e SellerAdsList repetem lógica de contagem e limites; extrair hook `useSellerAdsLimits(userId)` (produtos/serviços/canAdd) se fizer sentido. Cores hardcoded (slate) nos dashboards; usar tokens (e.g. `foreground`, `muted`).
- **Tipos**: Ad, User, Banner, Category estão em `[types/index.ts](src/types/index.ts)`; está bom. Garantir que tipos Supabase (quando existirem) mapeiem para estes.
- **Error boundaries**: Não há Error Boundary global; um erro não capturado derruba a app. Adicionar um em App ou Layout para mostrar mensagem genérica e link para recarregar.
- **Loading global**: Não há loading de bootstrap (seed é síncrono a partir de storage). Com Supabase, haverá loading inicial de sessão e dados; preparar um estado de loading no AuthProvider/AppProvider e um spinner ou skeleton no Layout.
- **Organização**: Estrutura por features vs por tipo está mista (pages/, components/ layout vs marketplace vs ads). Aceitável para o tamanho actual; evitar mais fragmentação sem necessidade.
- **Complexidade estimada**: Esconder ads de não aprovados (S). Error boundary (S). Unificar cores do dashboard (S). Hook useSellerAdsLimits (S). Integrar AppContext com repos (M). React Query opcional (L).

---

## 5. Supabase readiness

### 5.1 Tabelas sugeridas

- **profiles** (ou **users**): `id` (uuid, PK = auth.uid), `full_name`, `email`, `whatsapp`, `province`, `role` (admin/seller), `status` (pending/approved/rejected/blocked/suspended), `account_type` (seller/provider/both), `created_at`, `updated_at`. Nota: com Supabase Auth, email vem do auth.users; senha não se guarda aqui.
- **ads**: `id` (uuid), `owner_id` (FK profiles), `type` (product|service), `title`, `description`, `price` (numeric nullable), `price_on_request` (boolean), `province`, `city`, `neighborhood` (nullable), `category_id` (FK categorias), `whatsapp`, `status` (published|hidden/draft), `likes_count` (int default 0), `created_at`, `updated_at`. Título e descrição em texto; índices por status, owner_id, category_id, updated_at.
- **ad_images**: `id`, `ad_id` (FK ads), `path` (storage path ou URL), `sort_order` (int), `created_at`. Ou guardar array de URLs no ad se preferir modelo mais simples.
- **categories**: `id`, `name`, `slug`, `icon` (opcional), `created_at`.
- **banners**: `id`, `title`, `image_path` (storage), `link` (opcional), `active` (boolean), `sort_order`, `created_at`.
- **likes**: `id`, `ad_id` (FK), `user_id` (nullable, FK profiles) ou `device_id` (nullable, string hashed) para anónimos, `created_at`. Unique (ad_id, user_id) ou (ad_id, device_id). Alternativa: só `likes_count` em ads e tabela likes para evitar duplicados (contagem via trigger ou RPC).
- **admin_settings** (opcional): `id`, `key`, `value` (jsonb) para ACTIVATION_FEE_MT, WHATSAPP_ADMIN, etc.

### 5.2 RLS (resumo)

- **profiles**: SELECT para utilizadores autenticados (campos públicos); INSERT para o próprio (on signup); UPDATE para o próprio ou para admin. DELETE restrito a admin se necessário.
- **ads**: SELECT para `published = true` OU owner_id = auth.uid() OU admin; INSERT para utilizadores aprovados (e não bloqueados); UPDATE/DELETE para owner ou admin. Garantir que bloqueados não inserem.
- **ad_images**: SELECT para quem pode ver o ad; INSERT/UPDATE/DELETE para owner do ad ou admin.
- **categories**: SELECT público; INSERT/UPDATE/DELETE admin.
- **banners**: SELECT público onde active; INSERT/UPDATE/DELETE admin.
- **likes**: SELECT próprio; INSERT (um like por ad por user/device) via policy ou RPC que verifica limite; DELETE próprio. Evitar UPDATE em likes (apenas insert/delete).

### 5.3 Storage (Supabase Storage)

- **Buckets**: `ad-images` (público read), `banner-images` (público read).
- **Pipeline**: Cliente comprime (manter `imageCompression.ts`) → upload ficheiro (blob) para `ad-images/{owner_id}/{ad_id}/{uuid}.jpg` → guardar path em `ad_images` (ou array em `ads`). Ao apagar anúncio ou substituir imagens, apagar ficheiros antigos (Edge Function ou trigger).
- **Banners**: Upload para `banner-images/{id}.jpg` (ou uuid); path em `banners.image_path`.

### 5.4 Estratégia de integração

- **Auth**: Supabase Auth (signUp/signIn/signOut). No signUp, criar linha em `profiles` com status `pending`. Session no AuthProvider; redirecionamentos mantêm lógica actual (pending → /ativacao, admin → /admin, aprovado → /vendedor).
- **Repos**: Implementar `adsRepo.supabase.ts`, `usersRepo.supabase.ts` (profiles), `bannersRepo.supabase.ts` com cliente Supabase. Manter interface actual (list, getById, create, update, delete) onde fizer sentido. AppContext (ou um DataProvider) passa a chamar repos em vez de storage; escolher repo local vs supabase por env (ex.: VITE_USE_SUPABASE).
- **Migração gradual**: Pode manter storage para desenvolvimento offline e Supabase para produção; ou migrar de uma vez com script de import (export JSON de localStorage → script que insere em Supabase).

---

## 6. Roadmap por fases

### Fase 1: UI/UX e consistência (sem backend)

**Tarefas**

- Esconder anúncios de vendedores não aprovados nas listagens públicas (getPublishedAds e derivados).
- Substituir `window.confirm` por Dialog (exclusão de anúncio, exclusão de banner).
- Empty states: mensagens e CTAs específicos (listagem, categorias, dashboard).
- (Opcional) CTA WhatsApp no card do marketplace (ícone ou link "Contactar").
- Formulário anúncio: estado de loading no submit e feedback de sucesso (toast ou mensagem).
- Dashboard vendedor: usar tokens de cor (foreground, muted, border) em vez de slate hardcoded.
- Tratar estado "suspended" na Activation (ou mapear para bloqueado).
- Error Boundary global no Layout ou App com mensagem e link para recarregar.

**Esforço**: ~3–5 dias (solo).

**Critérios de aceite**

- Anúncios de utilizadores bloqueados/rejeitados não aparecem no Home nem em AdListing.
- Exclusões usam modal de confirmação (Dialog).
- Empty states com texto útil e acção clara.
- Submit do AdForm mostra loading e feedback.
- Erro não capturado não derruba a app inteira.

**Riscos**: Nenhum crítico.

---

### Fase 2: Lógica completa e fiabilidade (continua local)

**Tarefas**

- Garantir limites 10/5 em todos os pontos (AdForm criar/editar; desabilitar "Novo" no dashboard quando no limite).
- Decisão rascunho vs publicado: ou adicionar "Guardar como rascunho" no AdForm ou manter só "Publicar" e documentar.
- Filtro de listagem: melhorar UX do filtro "local" (placeholder, ou select província/cidade se adicionar province ao Ad).
- Banners: quando 0 activos, mostrar placeholder ou não renderizar secção (evitar null sem fallback).
- Testes manuais: fluxo completo (signup → ativação → aprovação admin → criar anúncio → ver no marketplace → contacto WhatsApp); admin bloqueia → anúncios desaparecem.
- Documentar regras de negócio (quem vê o quê, limites, estados).

**Esforço**: ~2–3 dias.

**Critérios de aceite**

- Limites 10/5 respeitados e UI reflecte isso.
- Listagem e filtros testados; anúncios de bloqueados não aparecem.
- Banners sem itens activos não quebram a página.

**Riscos**: Baixo.

---

### Fase 3: Integração Supabase

**Tarefas**

- Criar projeto Supabase; definir tabelas (profiles, ads, ad_images, categories, banners, likes ou likes_count).
- Configurar RLS conforme secção 5.2.
- Criar buckets ad-images e banner-images; políticas de upload (owner/admin).
- Implementar Auth (signUp/signIn/signOut); criar profile com pending no signUp; persistir sessão.
- Implementar repos Supabase (ads, profiles, banners, categories); manter interface igual à local.
- AppContext ou DataProvider: trocar storage por chamadas aos repos (com flag de env); manter seed/local para dev sem backend se desejado.
- AdForm: após compressão, upload para Storage e guardar path no ad; ao editar, substituir imagens e apagar ficheiros antigos.
- Admin Banners: upload para Storage e path em banners.

**Esforço**: ~1–2 semanas.

**Critérios de aceite**

- Login/registo via Supabase; redirects por role/status iguais aos actuais.
- CRUD de anúncios e perfis persistido em Supabase; imagens em Storage.
- Listagens públicas só mostram anúncios publicados de utilizadores aprovados (via RLS ou filtro no cliente).
- Admin consegue gerir utilizadores e banners.

**Riscos**: Migração de dados existentes (localStorage → Supabase) se necessário; tratar offline/erro de rede.

---

### Fase 4: Produção

**Tarefas**

- Variáveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY); sem segredos no cliente.
- Tratamento de erros de rede e timeouts nas chamadas Supabase; mensagens amigáveis.
- SEO básico: meta tags, títulos por página, eventualmente SSR/SSG se necessário.
- Performance: lazy load de rotas (React.lazy); otimização de imagens (Supabase transform ou CDN).
- Monitorização: erros (ex.: Sentry) e analytics mínimos (ex.: página vista, clique WhatsApp) se desejado.
- Checklist de segurança: RLS revisto; sem dados sensíveis no client; rate limit no Auth se necessário.

**Esforço**: ~3–5 dias.

**Critérios de aceite**

- App deployável com Supabase; env configurado.
- Erros de rede tratados; utilizador vê mensagem clara.
- Títulos e meta por rota; bundle razoável (lazy onde fizer sentido).

**Riscos**: Dependência de serviços externos (Supabase); plano de backup/export de dados.

---

## 7. Ordem recomendada (solo)

1. **Imediato**: Esconder anúncios de não aprovados (P0) e Error Boundary (robustez).
2. **Fase 1**: Restantes itens P0/P1 de UI/UX e confirmações em Dialog.
3. **Fase 2**: Limites e regras explícitas; testes manuais.
4. **Fase 3**: Supabase (schema → Auth → repos → Storage).
5. **Fase 4**: Env, erros, SEO e deploy.

Este plano mantém o MVP utilizável e profissional antes de trocar o backend, e prepara a migração para Supabase com passos claros e critérios de aceite por fase.