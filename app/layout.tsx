import type { Metadata } from 'next';
import { Onest, Marck_Script } from 'next/font/google';
import './globals.css';

// Onest is a variable font — covers the full weight range we use (400–700)
// without separate weight files. Cyrillic subset is required (UI is Russian).
const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
});

// Marck Script — a more characterful pen-script for the hero accents (heading word
// + subhead lead). Single weight 400; cyrillic subset required (accents are Russian).
const script = Marck_Script({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
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
