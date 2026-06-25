# Contributing to tachos.ru

## Setup

Node version is pinned in `.nvmrc` (`nvm use`), then:

```bash
npm install
npm run dev        # → http://localhost:3000
```

No backend, no database — it's a fully static site.

## Workflow

1. **Branch off `main`**: `git checkout -b fix/case-cover-radius` (or `claude/<topic>-YYYY-MM-DD`)
2. **Type check before each commit**: `npm run typecheck`
3. **Build before pushing**: `npm run build` — the static export must pass, it's
   exactly what gets deployed
4. **Manual check**: open `localhost:3000` and eyeball the section you changed
5. **Commit message**: imperative mood, "what + why". Add a `Co-Authored-By` trailer if AI helped
6. **Push & PR**: open a PR into `main`; CI (`ci.yml`) runs typecheck + lint + build
7. **Deploy**: merging to `main` triggers `deploy.yml`, which publishes to GitHub Pages automatically

## Code style

Full conventions live in [AGENTS.md](./AGENTS.md). Highlights:

### TypeScript

- `strict: true`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (use `import type` for type-only imports)
- Run `npm run typecheck` before every commit

### React / Next 16

- This is Next 16 with **static export** (`output: 'export'`) — there is no server runtime
- `params` is async (`await params`); every dynamic route needs `generateStaticParams` with `dynamicParams = false`
- Server components by default; add `'use client'` only for state, refs, or browser APIs
- Wrap every `<Image src>` in `asset()` from `lib/asset.ts` — static export does **not** prefix the basePath for `next/image`

### Styling

- Tailwind utility classes. Design tokens are CSS variables in `app/globals.css` →
  `tailwind.config.ts` → semantic classes (`bg` / `ink` / `surface` / `accent`). Don't hardcode hex
- One component per file, PascalCase filename. Homepage sections in `components/sections/`

### Content

- All page copy and data lives in `lib/content.ts`. UI text is Russian; code and
  comments are English, and comments explain **why**, not what

### Formatting

- Prettier (`npm run format`) — single quotes, width 100, Tailwind class sort
