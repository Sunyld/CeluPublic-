# Setup Shadcn, React 19, Tailwind v4 e TypeScript 5

Este projeto já usa **TypeScript 5** e estrutura compatível com shadcn/ui. Abaixo estão as instruções para alinhar com React 19, Tailwind v4 e shadcn CLI, se quiser actualizar.

---

## Estrutura Shadcn no projeto

- **Componentes UI:** `src/components/ui/` (button, card, badge, input, label)
- **Utilitários:** `src/lib/utils.ts` (`cn`)
- **Variantes de demonstração:** `src/components/shadcn-studio/`
  - `button/button-01.tsx`
  - `card/card-01.tsx` (login)
  - `card/card-12.tsx` (produto)
- **Ficheiro de estilos globais:** `src/index.css` (variáveis CSS do tema)
- **Alias:** `@/*` → `src/*` em `vite.config.ts` e `tsconfig.app.json`

O ficheiro `components.json` na raiz descreve esta estrutura para o **shadcn CLI**.

---

## Instalar componentes via shadcn CLI

Com o alias `@` já configurado:

```bash
npx shadcn@latest add button card input label badge
```

Isto adiciona/sobrescreve componentes em `src/components/ui/` e usa `src/lib/utils.ts`. Se o CLI perguntar pelo caminho de `utils`, use `@/lib/utils` ou `src/lib/utils`.

---

## React 19

**Estado actual:** o projeto usa React 18.

Para usar React 19:

```bash
npm install react@^19 react-dom@^19
npm install -D @types/react@^19 @types/react-dom@^19
```

Ajuste as tipagens se alguma API tiver mudado (ex.: tipos de `ref` ou props).

---

## Tailwind CSS v4

**Estado actual:** o projeto usa Tailwind v3 (PostCSS + `tailwind.config.js`).

Tailwind v4 usa outra configuração (CSS-first, muitas vezes sem `tailwind.config.js`). Para migrar:

1. **Documentação oficial:** [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

2. **Instalação típica (Vite):**
   ```bash
   npm install tailwindcss@next @tailwindcss/vite@next
   ```
   No `vite.config.ts`:
   ```ts
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     // ...
   });
   ```

3. **CSS:** em `src/index.css` trocar para:
   ```css
   @import "tailwindcss";
   ```
   e mover variáveis de tema para a sintaxe suportada no v4.

4. **Tema shadcn:** verificar na [doc do shadcn](https://ui.shadcn.com/docs) se há passos específicos para Tailwind v4.

---

## TypeScript 5

**Estado actual:** o projeto já usa TypeScript 5 (`typescript@^5.5.3` em `package.json`). Nenhuma acção extra é necessária para “suportar TypeScript 5”.

---

## Usar as variantes shadcn-studio no projeto

As variantes estão em:

- `src/components/shadcn-studio/button/button-01.tsx`
- `src/components/shadcn-studio/card/card-01.tsx`
- `src/components/shadcn-studio/card/card-12.tsx`

Exemplo de uso:

```tsx
import ButtonDemo from '@/components/shadcn-studio/button/button-01';
import CardDemo from '@/components/shadcn-studio/card/card-01';
import CardProductDemo from '@/components/shadcn-studio/card/card-12';
```

Também pode abrir **`/shadcn-studio`** na app para ver as três variantes numa única página.

---

## CSS / globals

O projeto não tem `globals.css`; os estilos globais e variáveis do tema estão em **`src/index.css`**. Qualquer variável ou estilo extra pedido pela doc do shadcn deve ser adicionado a `src/index.css` (ou, se mais tarde criares `globals.css`, podes migrar para lá e importá-lo no ponto de entrada da app).
