# ✅ Checklist de Validação - CeluPublic

Siga estes passos para garantir que as correções foram aplicadas corretamente.

## 1. Banco de Dados e RLS
- [ ] Rodar `20260220_CONSOLIDATED_OFFICIAL_FIX.sql` no SQL Editor (Sem erros).
- [ ] Verificar se a tabela `seller_requests` existe.
- [ ] Tentar rodar o script uma segunda vez (deve ser idempotente).

## 2. Onboarding e Auth
- [ ] Criar uma conta nova.
- [ ] Verificar se redireciona automaticamente para `/vendedor/ativacao`.
- [ ] Verificar se o status inicial no banco é `pending_payment`.

## 3. Fluxo de Ativação
- [ ] No `/vendedor/ativacao`, preencher método e referência e clicar em "Confirmar Pago".
- [ ] Verificar se a tela muda para "Pagamento em Verificação".
- [ ] Verificar se aparece uma entrada na tabela `seller_requests`.

## 4. Admin (Aprovação)
- [ ] Aceder como Admin (e-mail configurado).
- [ ] Ir a `Solicitações` (Dashboard Admin).
- [ ] Clicar em "Aprovar" na solicitação criada.
- [ ] Verificar se o status do perfil do usuário mudou para `approved`.

## 5. Dashboards e Uploads
- [ ] Tentar acessar `/vendedor` com a conta aprovada.
- [ ] Tentar criar um anúncio com imagens (Upload deve funcionar).
- [ ] Acessar como Admin e trocar um Banner (Upload deve funcionar via API segura).

## 6. Layout
- [ ] Confirmar que no Dashboard Admin/Vendedor **NÃO** aparece o Header/Footer do site principal.
