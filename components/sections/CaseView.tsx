'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CaseCover } from '@/components/CaseCover';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { ctaBanner, type CaseItem } from '@/lib/content';

// Placeholder media block — real case stills come from Vadim later.
function ImgPlaceholder({ minH = 300 }: { minH?: number }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-[24px] bg-white/[0.04]"
      style={{ minHeight: minH }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </div>
  );
}

// Side notes panel (#13) — pinned to the right edge of the max-w-page grid (the
// SAME grid the footer uses), in Onest (not mono). Fades out at the CTA.
function NotesPanel({ item, atCta }: { item: CaseItem; atCta: boolean }) {
  const rows = [
    { k: 'Клиент', v: item.client },
    { k: 'Направление', v: item.category },
    { k: 'Что делали', v: item.tags.join(' · ') },
  ];
  return (
    <div
      className={`fixed top-0 z-10 hidden h-screen w-[240px] flex-col pb-10 pt-28 transition-opacity duration-500 lg:flex ${
        atCta ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ right: 'max(48px, calc((100vw - 1440px) / 2 + 60px))' }}
    >
      <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-inverted/80">
        Заметки
      </p>
      <div className="space-y-4 border-l border-white/10 pl-4">
        {rows.map((r) => (
          <div key={r.k}>
            <p className="text-[12px] uppercase tracking-[0.04em] text-inverted/30">{r.k}</p>
            <p className="text-[15px] leading-[1.4] text-inverted/70">{r.v}</p>
          </div>
        ))}
        {item.verified && (
          <p className="text-[14px] font-medium text-accent">✦ Подтверждённый кейс</p>
        )}
      </div>
    </div>
  );
}

// Case page — Onest + max-w-page grid (the same grid as the footer), with the
// side "Заметки" panel pinned to the right edge.
export function CaseView({ item, others }: { item: CaseItem; others: CaseItem[] }) {
  const [atCta, setAtCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtCta(e?.isIntersecting ?? false), {
      rootMargin: '0px 0px -40% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [domainTag, methodTag] = item.tags;

  return (
    <main className="min-h-screen bg-bg text-inverted [animation:fade-in_0.4s_ease-out]">
      <Nav />
      <NotesPanel item={item} atCta={atCta} />

      {/* same container as the footer: max-w-page + lg:px-[96px] */}
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-[96px]">
        <div className="pt-[116px] lg:pt-[140px]">
          <Link
            href="/#cases"
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
            Назад
          </Link>
        </div>

        {/* content column leaves room on the right for the notes panel (lg) */}
        <div className="lg:pr-[300px]">
          {/* HERO */}
          <section className="mb-14 pt-8">
            <p className="mb-3 text-[15px] font-medium tracking-[0.02em] text-accent-warm">
              {domainTag} · {methodTag}
            </p>
            <h1 className="mb-5 text-[clamp(34px,5.5vw,64px)] font-semibold leading-[0.98] tracking-[-0.02em]">
              {item.client}
            </h1>
            <p className="mb-10 max-w-[620px] text-[clamp(17px,1.4vw,21px)] leading-[1.45] text-inverted/55">
              {item.story.summary}
            </p>

            <div className="flex flex-wrap gap-x-12 gap-y-7">
              {item.story.metrics.map((m) => (
                <div key={m.label}>
                  <p className="nums text-[34px] font-semibold leading-none tracking-[-0.02em] text-inverted">
                    {m.value}
                  </p>
                  <p className="mt-2 text-[14px] text-inverted/45">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 aspect-[16/9] max-w-[820px] overflow-hidden rounded-[24px]">
              <CaseCover
                id={item.id}
                client={item.client}
                shot={item.shot}
                shotKind={item.shotKind}
                variant="hero"
              />
            </div>
          </section>

          {/* NARRATIVE SECTIONS */}
          {item.story.sections.map((s) => (
            <div key={s.title}>
              <div className="mb-12 h-px w-full max-w-[820px] bg-white/10" />
              <section className="mb-12">
                <h2 className="mb-5 text-[clamp(24px,3vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em]">
                  {s.title}
                </h2>
                <p className="mb-9 max-w-[680px] text-[clamp(17px,1.3vw,20px)] leading-[1.6] text-inverted/70">
                  {s.body}
                </p>
                <ImgPlaceholder minH={300} />
              </section>
            </div>
          ))}

          {/* CTA */}
          <div className="mb-12 h-px w-full max-w-[820px] bg-white/10" />
          <div ref={ctaRef} id="contacts" className="max-w-[820px]">
            <button
              type="button"
              data-compose
              className="block w-full rounded-[24px] bg-white/[0.04] px-7 py-14 text-center transition-colors hover:bg-white/[0.06]"
            >
              <p className="mx-auto mb-6 max-w-[560px] text-[clamp(20px,2.4vw,28px)] font-semibold leading-[1.15] tracking-[-0.02em]">
                {ctaBanner.title}
              </p>
              <span className="text-[17px] font-medium text-accent-bright">{ctaBanner.cta} →</span>
            </button>
          </div>

          {/* OTHER CASES */}
          <section className="mt-20 pb-6">
            <h2 className="mb-8 text-[clamp(24px,3vw,34px)] font-semibold tracking-[-0.02em]">
              Другие кейсы
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {others.map((c) => (
                <Link key={c.id} href={`/cases/${c.id}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-[20px]">
                    <CaseCover
                      id={c.id}
                      client={c.client}
                      shot={c.shot}
                      shotKind={c.shotKind}
                      variant="card"
                      className="transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <p className="mt-3 text-[17px] font-medium text-inverted">{c.client}</p>
                  <p className="text-[14px] text-inverted/40">{c.category}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
