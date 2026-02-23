# CeluPublic MVP – UI Fix & Refactor (Deliverables)

## 1) Root cause: “Changes not visible”

- **Cause:** The project had **two** UI locations:
  - **`project/@/components/ui/*`** – folder literally named `@` at project root (button, card, badge, input, label).
  - **`project/src/components/ui/*`** – canonical UI used by the app.

- **How the app runs:** Vite and `tsconfig.app.json` resolve the alias `@` to **`./src`** only. So at runtime all imports like `@/components/ui/button` resolve to **`src/components/ui/button`**. The folder `project/@/` was never part of the build; it was leftover (e.g. from a shadcn CLI run that wrote to a literal `@` path).

- **Why it could look like “changes not visible”:** If someone edited files under `project/@/components/ui/` thinking they were the app’s UI, the app would keep using `src/components/ui/` and show no change. Or tooling/IDE could open the wrong path.

- **Fix:** The duplicate UI under **`project/@/components/ui/`** was **removed** (all 5 files deleted). The single source of truth is **`src/components/ui/`**. All `@/` imports now unambiguously point to `src/`.

---

## 2) Exact files changed

| Action | Path |
|--------|------|
| Deleted | `@/components/ui/button.tsx` |
| Deleted | `@/components/ui/card.tsx` |
| Deleted | `@/components/ui/badge.tsx` |
| Deleted | `@/components/ui/input.tsx` |
| Deleted | `@/components/ui/label.tsx` |
| Created | `src/components/marketplace/CategoryPills.tsx` |
| Replaced | `src/pages/Home.tsx` (Banner + CategoryPills, filtered grid, “Mais curtidos”, labels PT) |
| Replaced | `src/components/layout/Footer.tsx` (4-column professional footer) |
| Fixed | `src/components/banners/BannerCarousel.tsx` (Button → AppButton) |
| Fixed | `src/pages/admin/AdminBanners.tsx` (Button → AppButton) |

Existing and already aligned with the spec (no structural change in this pass):

- `src/components/marketplace/banner.tsx` – full-width hero, mobile `object-contain`, stable aspect.
- `src/components/marketplace/ad-card.tsx` – `MarketplaceAdCard` with `aspect-[4/3]`, `object-cover`, like, WhatsApp.
- `src/components/ui/app-button.tsx` – AppButton wrapper around shadcn Button.
- `src/components/ads/AdCard.tsx` – uses `MarketplaceAdCard` + `buildWhatsAppUrl`.
- Likes: `src/lib/storage.ts` (e.g. `celupublic_liked`) + `AppContext` toggleLike; ranking by `likedCount` in Home and context.

---

## 3) Confirmation: “/” and “/anuncios” render the new UI

- **`/` (Home):**
  - Renders **Banner** (admin-managed, mobile full image, desktop hero).
  - Under the banner: **CategoryPills** (Todos, Produtos, Serviços, Eletrónica, Vestuário, Serviços Domésticos, Construção e Reparação, Automóveis, Alimentação).
  - Sections: “Anúncios em destaque” (filtered by pill, sorted by likes), “Categorias”, “Mais curtidos”.
  - All ad blocks use **AdCard** → **MarketplaceAdCard** (shadcn-studio card-12 style).

- **`/anuncios` (Ad listing):**
  - Uses the same **AdCard** → **MarketplaceAdCard** for every ad; filter buttons and grid unchanged in behavior, UI is the new card style.

---

## 4) Typecheck

- `npm run typecheck` was run and **completed successfully** (exit code 0).

---

## 5) Clear Vite cache and run dev (Windows PowerShell)

```powershell
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

After that, the app loads all UI from **`src/`** only; no duplicate `@` folder.

---

## 6) 21st.dev (Step 8)

- Header and Footer were **not** replaced by an external 21st.dev package. The current **Header** and **Footer** are built with **shadcn/ui primitives + Tailwind** and follow a clean, product-like layout (e.g. 4-column footer, consistent nav).
- To use **21st.dev** later for Navbar/Header or Footer: install the desired block from the 21st.dev registry and swap the existing `Header`/`Footer` in `src/components/layout/`; keep using only shadcn Button/Card and Tailwind so no extra UI library is introduced.
