import type { Metadata } from 'next';
import { companyDescription } from '@/lib/content';
import { Onest, PT_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ComposeProvider } from '@/components/compose/ComposeProvider';
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget';

// Onest is a variable font — covers the full weight range we use (400–700)
// without separate weight files. Cyrillic subset is required (UI is Russian).
const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
});

// PT Mono — technical monospace for case-page labels, captions and meta (mirrors
// the portfolio case look). Cyrillic subset, single weight.
const ptMono = PT_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Разработка сложных цифровых продуктов — Tachos',
  description:
    'Tachos — технологический партнер по разработке мобильных и веб-приложений, backend, интеграций и внутренних систем. Создаем продукты с нуля и развиваем существующие.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ComposeProvider lives here (not in a page) so the letter modal, mascot and
  // floating CTA work on every route (home, case, blog), and the draft survives
  // client-side navigation between them.
  return (
    <html lang="ru" className={`${onest.variable} ${ptMono.variable}`}>
      <body>
        {/* One machine-readable company description, identical to the sentence the
            copy doc asks us to reuse in catalogues and press profiles. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tachos',
              foundingDate: '2012',
              description: companyDescription,
            }),
          }}
        />
        <SmoothScroll>
          <ComposeProvider>{children}</ComposeProvider>
          <FeedbackWidget />
        </SmoothScroll>
      </body>
    </html>
  );
}
