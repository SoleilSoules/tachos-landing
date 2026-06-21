import type { Config } from 'tailwindcss';

// Tachos design tokens. Colours are CSS variables (RGB channels, space-separated)
// defined in app/globals.css so `<alpha-value>` keeps Tailwind's `/opacity`
// modifiers working (e.g. text-fg/60, bg-accent/10). Single source of truth —
// never hardcode hex in components, use the semantic class.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('--c-bg'), // page black #040404
        ink: v('--c-ink'), // dark navy-tinted surface #110a0f (founder card, hero veil)
        surface: v('--c-surface'), // cool light #f5f7fb (chips on dark, sections)
        surface2: v('--c-surface2'), // light grey #f0f1f3 (hero pills)
        fg: v('--c-fg'), // primary text #040404
        inverted: v('--c-inverted'), // white text on dark
        accent: {
          DEFAULT: v('--c-accent'), // #f05138 — primary orange
          bright: v('--c-accent-bright'), // #ff522c — hotter (nav pill, founder dash)
          hot: v('--c-accent-hot'), // #fe4a00 — input caret
          warm: v('--c-accent-warm'), // #f0611f — hero subhead lead
        },
      },
      fontFamily: {
        sans: ['var(--font-onest)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        chip: '10px', // hero "Мне нужен" pills
        tag: '8px', // case tags
        button: '14px', // nav "Связаться"
        input: '28px', // hero input card
        card: '40px', // case cards
        founder: '40px', // founder block
        pill: '36px', // filter tabs
      },
      boxShadow: {
        input: '0px 6.769px 82.585px 0px rgba(44,23,68,0.25)',
      },
      maxWidth: {
        page: '1440px', // Figma frame width — the design grid
      },
    },
  },
  plugins: [],
};

export default config;
