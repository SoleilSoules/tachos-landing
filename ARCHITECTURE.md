# Architecture

How tachos.ru is wired up — for someone joining the project mid-flight.

## High-level picture

```
  GitHub repo (SoleilSoules/tachos-landing), branch `main`
            │ push
            ▼
  GitHub Action `deploy.yml`
   ─ npm ci
   ─ next build  (output: 'export')  →  out/   (static HTML / CSS / JS)
   ─ publish to GitHub Pages
            │
            ▼
  https://soleilsoules.github.io/tachos-landing/     (static, no server)
```

No backend, no database — a fully static marketing site. The compose / letter
form is a **client-side demo** (`components/compose/ComposeProvider.tsx`); real
submission is Vadim's TODO (see `FEEDBACK_FOR_VADIM.md`).

## Stack

- **Next.js 16** — App Router + Turbopack, `output: 'export'` (static export)
- **React 19**, TypeScript `strict`
- **Tailwind 3.4**, font **Onest**, design tokens as CSS variables
- Smooth scroll via **Lenis** (`components/SmoothScroll.tsx`), desktop only

## Layout

| path | what |
|---|---|
| `app/page.tsx` | homepage — composes the sections |
| `app/cases/[slug]`, `app/blog/[slug]` | SSG sub-pages (`generateStaticParams`, `dynamicParams = false`) |
| `app/globals.css` | design tokens (CSS vars) + keyframes |
| `components/sections/` | homepage sections (Hero, CasesExplorer, Reviews, Products, Blog, Footer…) |
| `components/` | shared UI + `compose/` (letter widget + cursor mascot) |
| `lib/content.ts` | all page copy & data (cases, reviews, products, hero) |
| `lib/` | `asset.ts` (basePath for images), `compose.ts`, `typography.ts` |
| `public/figma/` | images, device mockups, cover photos |

## Data flow

- Page content is static, imported from `lib/content.ts` — no fetching at runtime
- Cases drive both the homepage grid (`CasesExplorer` → `CaseCard` → `CaseCover`)
  and the `/cases/[slug]` pages; case-page prose lives in `lib/case-copy.ts`
- The letter/compose state is React context (`ComposeProvider`) shared by the hero
  input, the floating pill, the footer letter, and the mascot

## Conventions

See [AGENTS.md](./AGENTS.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).
