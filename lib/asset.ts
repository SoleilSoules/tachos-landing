// Prefix public asset paths with the GitHub Pages basePath in production.
// next/image with `unoptimized` does NOT prepend basePath to src, so static
// assets (/figma, /logos) 404 on the project site. Wrap every public src here.
const BASE = process.env.NODE_ENV === 'production' ? '/tachos-landing' : '';

export const asset = (path: string) => `${BASE}${path}`;
