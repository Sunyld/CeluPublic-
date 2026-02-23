# 🛠️ Checklist de Depuração e Auditoria

Este documento serve para validar as correções críticas de Auth, RLS, Storage e Layout.

## 1. Testes de Funcionalidade (Manual)

| Item | Passo | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- |
| **Login** | Fazer login com Google ou Email/Senha | Redireciona para o dashboard correto sem loop. | 🔄 Pendente |
| **Refresh** | Pressionar F5 em uma página interna | Permanece logado e na mesma página. | 🔄 Pendente |
| **Redirect Admin** | Logar como `sunyldjosesomailamatapa@gmail.com` | Redireciona para `/admin`. | 🔄 Pendente |
| **Redirect Seller** | Logar como vendedor NOVO | Redireciona para `/vendedor/ativacao`. | 🔄 Pendente |
| **Upload Banner** | Como Admin, subir novo banner | Sucesso (sem erro 400). Imagem aparece na lista. | 🔄 Pendente |
| **Upload Produto** | Como Seller aprovado, criar anúncio com imagens | Sucesso. Imagens aparecem no detalhe do anúncio. | 🔄 Pendente |
| **Layouts** | Acessar `/admin` ou `/vendedor` | NÃO aparece o Header/Footer do site público. | 🔄 Pendente |

---

## 2. Auditoria SQL (Supabase Editor)

Execute as queries abaixo no painel do Supabase para validar a integridade.

### A. Checar se Recursão de RLS foi removida
```sql
-- Deve retornar as policies criadas com is_admin() e sem subqueries em profiles
select schemaname, tablename, policyname, cmd
from pg_policies
where tablename in ('profiles', 'ads', 'banners', 'seller_requests')
order by tablename;
```

### B. Validar Tabela de Solicitações
```sql
-- Verificar se a tabela existe e tem os campos corretos
select count(*) from public.seller_requests;
```

### C. Validar Gatilho de Novo Usuário
```sql
-- Verificar se o perfil é criado automaticamente ao sinalizar um novo usuário no auth.users
select * from public.profiles order by created_at desc limit 5;
```

### D. Auditoria de Admin
```sql
-- Confirmar se o seu email está mapeado como admin
select public.is_admin(id), email, role from public.profiles where email = 'sunyldjosesomailamatapa@gmail.com';
```

---

## 3. Erros Conhecidos e Soluções

| Erro | Causa Raiz | Solução Aplicada |
| :--- | :--- | :--- |
| **42P17 (Recursion)** | Policy de `profiles` consultava a própria `profiles`. | Criada função `is_admin()` que consulta `auth.users`. |
| **400/403 Storage** | Policies de storage restritivas ou falta de bucket. | Uploads via Route Handlers (Server-side) com Service Role. |
| **404 seller_requests** | Tabela não existia no cache/schema. | Migração consolidada cria a tabela e dependências. |
| **Loop no Login** | Conflito de redirecionamento no AuthProvider. | Redirection logic baseada em status estrito no mounting. |

---

## 4. Configurações Finais
- **WhatsApp Admin**: `+258 87 833 0517`
- **Email Suporte**: `celupublic@gmail.com`
- **Taxa de Ativação**: `20 MT`
