# Correção de Auth Loop Infinito - Resumo Técnico

## Problemas Identificados e Corrigidos

### 1. **Múltiplos Listeners de `onAuthStateChange`**
**Causa**: O `useEffect` em `AuthContext.tsx` podia ser executado múltiplas vezes (StrictMode, re-renders), criando listeners duplicados.

**Correção**:
- Listener registrado **UMA vez** com `useEffect(..., [])` (deps vazias)
- `listenerRef` para garantir `unsubscribe` no cleanup
- Promise cache por `userId` em `ensureProfileForSupabaseUser` para evitar concorrência

### 2. **Redirects Concorrentes entre AuthCallback e AuthContext**
**Causa**: `AuthCallback` navegava diretamente para o destino final antes do `AuthContext` terminar de carregar o perfil, causando loops.

**Correção**:
- Criada página intermediária `/pos-login` que orquestra o redirect de forma segura
- `AuthCallback` agora navega para `/pos-login` (não diretamente para destino)
- `/pos-login` aguarda `authStatus === 'authenticated' && profileStatus === 'ready'` antes de navegar

### 3. **Loop em Login.tsx ao Acessar `/entrar` Já Logado**
**Causa**: `useEffect` com `user` e `location.pathname` nas deps causava re-execução infinita.

**Correção**:
- Adicionado `redirectDoneRef` para garantir redirect único
- Verificação explícita: `authStatus === 'authenticated' && profileStatus === 'ready'`
- Removida dependência de `location.pathname` que mudava ao navegar

### 4. **Estado Indefinido (authLoading stuck)**
**Causa**: `authLoading` era um boolean simples sem state machine clara, causando estados inconsistentes.

**Correção**:
- Implementada **state machine** explícita:
  - `authStatus`: `'booting' | 'anonymous' | 'authenticating' | 'authenticated'`
  - `profileStatus`: `'idle' | 'loading' | 'ready' | 'error'`
- `authLoading` agora é derivado: `!(authStatus === 'authenticated' && profileStatus === 'ready')`
- Timeout de segurança: 10s para `ensureProfile`, não trava tudo

### 5. **Falta de Feedback na UI**
**Causa**: Erros de login não eram mostrados claramente ao usuário.

**Correção**:
- Integrado `useToast` em `Login.tsx` para mostrar erros
- Página `/pos-login` mostra estados claros: loading, erro, timeout
- Contador visual de tempo (0-12s) com fallback após 12s

### 6. **AuthCallback Não Era 100% Idempotente**
**Causa**: `ranRef` e `processedRef` não eram suficientes para evitar re-execução em refresh.

**Correção**:
- Guards robustos: `ranRef` + `processedRef` + `redirectDoneRef`
- Limpeza completa da URL: `history.replaceState` remove hash/query antes de navegar
- Timeout hard de 10s com fallback para login

## Arquivos Alterados

### Novos Arquivos
- `src/lib/authInstrumentation.ts` - Instrumentação com trace IDs e logs estruturados
- `src/pages/PostLogin.tsx` - Página intermediária para orquestrar redirects

### Arquivos Modificados
- `src/context/AuthContext.tsx` - Reescrito como state machine, promise cache, guards anti-loop
- `src/pages/AuthCallback.tsx` - Idempotente, navega para `/pos-login`
- `src/pages/Login.tsx` - Guards anti-loop, integração com toast, navega para `/pos-login`
- `src/components/ProtectedRoute.tsx` - Usa novos estados (`authStatus`, `profileStatus`)
- `src/pages/Dashboard.tsx` - Usa `getPostLoginRedirect` helper
- `src/App.tsx` - Adicionada rota `/pos-login`

## Fluxo Corrigido

### Login com Email/Senha
1. Usuário submete formulário → `login()` chamado
2. `authStatus` muda para `'authenticating'`
3. Supabase `signInWithPassword` → sessão criada
4. `onAuthStateChange` dispara `SIGNED_IN`
5. `ensureProfileForSupabaseUser` carrega/cria perfil
6. `authStatus` → `'authenticated'`, `profileStatus` → `'ready'`
7. `Login.tsx` detecta estado pronto → navega para `/pos-login`
8. `/pos-login` verifica estado → navega para destino final (`/admin`, `/vendedor`, `/ativacao`)

### Login com Google (OAuth)
1. Usuário clica "Entrar com Google" → `loginWithGoogle()` chamado
2. Redireciona para Google → usuário autoriza
3. Google redireciona para `/auth/callback?code=...`
4. `AuthCallback` processa código → `exchangeCodeForSession`
5. Sessão confirmada → limpa URL → navega para `/pos-login`
6. `/pos-login` aguarda perfil pronto → navega para destino final

### Acessar `/entrar` Já Logado
1. `Login.tsx` detecta `authStatus === 'authenticated' && profileStatus === 'ready'`
2. `redirectDoneRef` garante redirect único
3. Navega diretamente para destino final (sem passar por `/pos-login`)

## Instrumentação e Debugging

### Logs Estruturados (DEV only)
Todos os eventos de auth são logados com:
- `attemptId`: ID único por tentativa de login
- `event`: Tipo do evento (`SIGNED_IN`, `PROFILE_LOADING`, `NAVIGATE`, etc.)
- `data`: Dados contextuais (userId, role, status, etc.)

Exemplo:
```
[AUTH_FLOW] SIGNED_IN { attemptId: 'auth_1234567890_abc123', userId: 'abc...' }
[AUTH_FLOW] PROFILE_LOADING { attemptId: 'auth_1234567890_abc123', userId: 'abc...' }
[AUTH_FLOW] PROFILE_READY { attemptId: 'auth_1234567890_abc123', role: 'admin', status: 'approved' }
[AUTH_FLOW] NAVIGATE { attemptId: 'auth_1234567890_abc123', to: '/admin', reason: 'post_login_ready' }
```

### Helpers de Debug
- `getAuthLogs()`: Retorna últimos 100 logs
- `clearAuthLogs()`: Limpa logs (útil para testes)

## Checklist de Validação

### ✅ Login com Email/Senha
- [ ] Login bem-sucedido redireciona para destino correto (admin → `/admin`, seller → `/vendedor`, pendente → `/ativacao`)
- [ ] Erro de credenciais mostra toast e não trava
- [ ] Não há loop infinito no console

### ✅ Login com Google
- [ ] OAuth redireciona para Google
- [ ] Após autorização, volta para `/auth/callback`
- [ ] `/auth/callback` processa e navega para `/pos-login`
- [ ] `/pos-login` aguarda perfil e navega para destino final
- [ ] Não há loop infinito

### ✅ Acessar `/entrar` Já Logado
- [ ] Redireciona automaticamente para destino correto
- [ ] Não cria loop de redirects

### ✅ Refresh da Página
- [ ] Usuário permanece logado após refresh
- [ ] Não há logout inesperado
- [ ] Perfil carrega corretamente

### ✅ Timeout e Erros
- [ ] Se `ensureProfile` demorar > 10s, mostra erro mas não trava tudo
- [ ] Se RLS error (42P17), mostra mensagem clara e não trava
- [ ] Timeout visual em `/pos-login` mostra contador e botão "Voltar ao login" após 12s

### ✅ Logs no Console (DEV)
- [ ] Logs estruturados aparecem para cada evento
- [ ] `attemptId` é consistente durante todo o fluxo
- [ ] Não há spam de logs repetidos

## Próximos Passos (Opcional)

1. **Adicionar testes E2E** para validar fluxos de login
2. **Monitoramento**: Enviar logs de auth para serviço de analytics (opcional)
3. **Rate limiting**: Adicionar throttling para tentativas de login falhadas
4. **Session refresh**: Melhorar tratamento de refresh token expirado

## Notas Técnicas

- **Singleton Supabase**: `getSupabase()` garante uma única instância do client
- **Promise Cache**: Evita múltiplas chamadas simultâneas de `ensureProfile` para o mesmo `userId`
- **Cooldown**: 30s de cooldown após falha de `ensureProfile` para evitar spam
- **URL Cleanup**: `history.replaceState` remove hash/query params para evitar re-processamento em refresh
