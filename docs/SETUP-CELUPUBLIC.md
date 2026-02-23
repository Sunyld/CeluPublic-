# CeluPublic – Setup (shadcn, React 19, Tailwind v4)

**Package manager:** npm

## Quick install (deps + shadcn components)

```bash
npm install lucide-react
npx shadcn@latest add button card input label badge
```

Then run the app: `npm run dev`

---

Paths from **`components.json`** (alias `@` = `src/`):

- **UI components:** `@/components/ui`
- **Utils (cn):** `@/lib/utils`
- **Base URL:** `./src` (via `tsconfig.app.json` and `vite.config.ts`)

---

## 1. Dependencies (project uses npm)

```bash
npm install lucide-react
```

---

## 2. Shadcn registry components

Add UI components via shadcn CLI (use the project’s runner):

```bash
npx shadcn@latest add button card input label badge
```

**Note:** `utils` is not a component; it’s the `cn()` helper. This project already has `src/lib/utils.ts`. If the CLI offers “utils”, you can skip it or add it so the CLI knows the path.

To add only missing pieces:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add badge
```

When prompted, use the paths from `components.json` (defaults are usually correct if `@` is set to `src/`).

---

## 3. React 19 (optional upgrade)

Current: **React 18**.

To upgrade to React 19:

```bash
npm install react@^19 react-dom@^19
npm install -D @types/react@^19 @types/react-dom@^19
```

Update `main.tsx` if the root API changes (e.g. `createRoot`).

---

## 4. Tailwind CSS v4 (optional upgrade)

Current: **Tailwind v3** with `tailwind.config.js` and `src/index.css`.

Tailwind v4 is CSS-first and uses a different config. To upgrade:

1. Install:

```bash
npm install tailwindcss@next @tailwindcss/vite@next
```

2. In `vite.config.ts` add the Tailwind plugin:

```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ...
});
```

3. In `src/index.css` switch to:

```css
@import "tailwindcss";
```

4. Migrate theme (colors, radius) from `tailwind.config.js` into CSS or the new Tailwind v4 config format. See [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

---

## 5. TypeScript 5

The project already uses **TypeScript 5** (`typescript@^5.5.3`). No extra steps.

---

## 6. Run the project

```bash
npm install
npm run dev
```

Open `/shadcn-studio` to see the card/button variants.  
Open `/` for the marketplace home (hero banner, featured ads, categories, top ranked, benefits).
