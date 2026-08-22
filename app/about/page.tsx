import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { about, companyDescriptionLong } from '@/lib/content';

export const metadata: Metadata = {
  title: 'О компании — Tachos',
  description: companyDescriptionLong,
};

// Sub-pages share the dark canvas of the case / blog views: Nav on top, the
// prose in the same max-w-page column, Footer (with the letter) at the bottom.
export default function AboutPage() {
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

        <section className="mb-16 pt-8 lg:mb-24">
          <h1 className="mb-6 max-w-[900px] text-[clamp(34px,5.5vw,64px)] font-semibold leading-[0.98] tracking-[-0.02em]">
            {about.hero.title}
          </h1>
          <p className="max-w-[720px] text-[clamp(17px,1.4vw,21px)] leading-[1.5] text-inverted/60">
            {about.hero.body}
          </p>
        </section>

        {about.sections.map((section) => (
          <section key={section.title} className="mb-12 lg:mb-16">
            <div className="mb-10 h-px w-full max-w-[820px] bg-white/10 lg:mb-12" />
            <h2 className="mb-5 max-w-[820px] text-[clamp(24px,3vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em]">
              {section.title}
            </h2>
            {section.paragraphs.map((text) => (
              <p
                key={text}
                className="mb-4 max-w-[720px] text-[17px] leading-[1.55] text-inverted/60 last:mb-0"
              >
                {text}
              </p>
            ))}
          </section>
        ))}

        {/* Vadim's letter — set apart from the studio's voice by the accent rule */}
        <section className="mb-14 max-w-[820px] border-l-2 border-accent pl-[22px] lg:mb-20 lg:pl-[32px]">
          <p className="mb-6 text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.25] tracking-[-0.015em]">
            {about.letter.lead}
          </p>
          {about.letter.paragraphs.map((text) => (
            <p key={text} className="mb-4 text-[17px] leading-[1.55] text-inverted/60">
              {text}
            </p>
          ))}
          <p className="mt-6 text-[15px] text-inverted/45">{about.letter.sign}</p>
        </section>

        <section className="mb-14 lg:mb-20">
          <div className="mb-10 h-px w-full max-w-[820px] bg-white/10 lg:mb-12" />
          <h2 className="mb-5 max-w-[820px] text-[clamp(24px,3vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            {about.team.title}
          </h2>
          {about.team.paragraphs.map((text) => (
            <p
              key={text}
              className="mb-4 max-w-[720px] text-[17px] leading-[1.55] text-inverted/60"
            >
              {text}
            </p>
          ))}
        </section>

        {/* «Их можно оставить одной компактной строкой» — the doc's own note */}
        <section className="mb-16 flex flex-wrap gap-x-[64px] gap-y-[24px] border-t border-white/10 pt-[32px] lg:mb-24">
          {about.figures.map((figure) => (
            <div key={figure.value}>
              <p className="nums text-[clamp(22px,2.4vw,30px)] font-semibold leading-none tracking-[-0.02em]">
                {figure.value}
              </p>
              <p className="mt-[10px] max-w-[240px] text-[15px] leading-[1.35] text-inverted/45">
                {figure.label}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-[80px] max-w-[720px] lg:mb-[120px]">
          <h2 className="mb-4 text-[clamp(24px,3vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            {about.cta.title}
          </h2>
          <p className="mb-8 text-[17px] leading-[1.55] text-inverted/60">{about.cta.body}</p>
          <button
            type="button"
            data-compose
            className="h-[54px] rounded-[14px] bg-accent px-[36px] text-[16px] font-medium text-inverted shadow-[0_10px_30px_rgba(240,81,56,0.35)] transition hover:brightness-110"
          >
            {about.cta.button}
          </button>
        </section>
      </div>

      <Footer />
    </main>
  );
}
