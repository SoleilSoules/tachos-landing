import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { privacy } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных — Tachos',
  description: privacy.lead,
  // A legal notice has no business in search results.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-inverted [animation:fade-in_0.4s_ease-out]">
      <Nav />

      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-[96px]">
        <div className="pt-[116px] lg:pt-[140px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[15px] text-inverted/45 transition-colors hover:text-inverted/80"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            На главную
          </Link>
        </div>

        <header className="mb-14 max-w-[760px] pt-8">
          <h1 className="mb-4 text-[clamp(30px,4.4vw,52px)] font-semibold leading-[1.02] tracking-[-0.02em]">
            {privacy.title}
          </h1>
          <p className="mb-6 text-[14px] text-inverted/40">{privacy.updated}</p>
          <p className="text-[clamp(17px,1.4vw,20px)] leading-[1.5] text-inverted/60">
            {privacy.lead}
          </p>
        </header>

        {privacy.sections.map((section) => (
          <section key={section.title} className="mb-10 max-w-[760px]">
            <h2 className="mb-4 text-[clamp(19px,2vw,24px)] font-semibold leading-[1.2] tracking-[-0.015em]">
              {section.title}
            </h2>
            {section.paragraphs.map((text) => (
              <p key={text} className="mb-3 text-[16px] leading-[1.6] text-inverted/60 last:mb-0">
                {text}
              </p>
            ))}
          </section>
        ))}

        <div className="h-[80px] lg:h-[120px]" />
      </div>

      <Footer letter={false} />
    </main>
  );
}
