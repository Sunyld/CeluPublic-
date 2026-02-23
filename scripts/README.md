# Scripts

## self-check.ts (Phase 2)

Verifica regras de negócio sem framework de testes:

- **Limites**: `MAX_PRODUCTS === 10`, `MAX_SERVICES === 5`
- **Selectors públicos**: apenas anúncios com `status === 'published'` e dono aprovado
- **Builder WhatsApp**: mensagem de produto/serviço contém CeluPublic, Preço/Serviço, etc.
- **Click tracking**: simulação em memória — tracking incrementa totais e `clicksByAdId`
- **Trending**: ordenação por cliques (desc) retorna ordem esperada

**Como executar** (na raiz do projeto):

```bash
npm run self-check
```

Ou diretamente: `node scripts/self-check.mjs`. Não é necessário tsx (o script `.mjs` roda com Node).

Saída esperada: `All N checks passed.`
