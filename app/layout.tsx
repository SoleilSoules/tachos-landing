import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

// Onest is a variable font — covers the full weight range we use (400–700)
// without separate weight files. Cyrillic subset is required (UI is Russian).
const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
});

// Handwritten accent for the hero — a local, non-Google face (installed by Gosha,
// cyrillic included). Swap `src` to try a different one.
const script = localFont({
  src: './fonts/Kurochkalapkoi.ttf',
  variable: '--font-script',
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
    <html lang="ru" className={`${onest.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
