<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Stack

Next.js 16 (App Router, Turbopack, **static export** → GitHub Pages) · React 19 · TypeScript strict · Tailwind 3.4 · Onest. Design tokens are CSS variables (RGB channels) in `app/globals.css` → `tailwind.config.ts` → semantic classes (`bg`/`ink`/`surface`/`accent`…). Page content lives in `lib/content.ts`. UI is Russian; code and comments are English, and comments explain **why**, not what.

## Conventions

- **Imports:** absolute via `@/*` — no deep `../../` chains.
- **Components:** one component per file, PascalCase filename. Page sections in `components/sections/`, shared UI in `components/`, `lib/` modules kebab/lowercase.
- **Formatting:** Prettier (`.prettierrc.json` — single quotes, width 100, Tailwind class sort). Run `npm run format`.
- **Linting:** ESLint flat config (`eslint.config.mjs`). Run `npm run lint`.
- **Types:** `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` (use `import type` for type-only imports). Run `npm run typecheck` before every commit.
- **Images:** static export does NOT prefix the basePath for `next/image`, so wrap every `<Image src>` in `asset()` from `lib/asset.ts`.

## Scripts

`dev` (→ :3000) · `build` (static export) · `typecheck` (`tsc --noEmit`) · `lint` · `format`.

## Deploy

Push to `main` → GitHub Action `deploy.yml` builds and publishes to GitHub Pages (`https://soleilsoules.github.io/tachos-landing/`). `ci.yml` runs typecheck + lint + build on PRs and pushes. Always run `npm run build` locally before pushing.

## Branching

Branch off `main` (`feature/<topic>` or `claude/<topic>-YYYY-MM-DD`), open a PR into `main`. Never commit secrets — `.env.example` is the committed template; real values go in `.env.local` (git-ignored).
