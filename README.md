# tachos.ru

Marketing landing for the **Tachos** engineering & design studio. Next.js 16
(App Router, Turbopack) with **static export** → GitHub Pages.

**Live:** https://soleilsoules.github.io/tachos-landing/

## Quick start (local dev)

```bash
nvm use            # node version from .nvmrc
npm install
npm run dev        # → http://localhost:3000
```

No backend or database — it's a fully static site.

## Scripts

| script | what |
|---|---|
| `npm run dev` | dev server (Turbopack) → :3000 |
| `npm run build` | static export to `out/` (run before every push) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Project layout

- `app/` — App Router routes (`page.tsx`, `cases/[slug]`, `blog/[slug]`) + `globals.css` (design tokens)
- `components/` — shared UI; `components/sections/` — homepage sections
- `lib/content.ts` — all page copy & data; `lib/` — helpers (`asset.ts`, `compose.ts`, `typography.ts`)
- `public/figma/` — images, device mockups, cover photos

## Working on it

- Conventions → [AGENTS.md](./AGENTS.md)
- Contributing (setup, workflow, style) → [CONTRIBUTING.md](./CONTRIBUTING.md)
- How it's wired → [ARCHITECTURE.md](./ARCHITECTURE.md)

**Deploy:** push to `main` → GitHub Action builds and publishes to GitHub Pages.
Always run `npm run build` locally first. CI (`ci.yml`) runs typecheck + lint + build on PRs.
