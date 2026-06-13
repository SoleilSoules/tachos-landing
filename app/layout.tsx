import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';

// Onest is a variable font — covers the full weight range we use (400–700)
// without separate weight files. Cyrillic subset is required (UI is Russian).
const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tachos — студия инжиниринга и дизайна',
  description:
    'Проектируем и собираем веб- и мобильные продукты для фаундеров и компаний — от идеи до релиза в проде.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>{children}</body>
    </html>
  );
}
