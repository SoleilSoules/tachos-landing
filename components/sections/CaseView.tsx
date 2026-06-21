'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ScatterZone } from '@/components/ScatterZone';
import { CaseCover } from '@/components/CaseCover';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { ctaBanner, type CaseItem } from '@/lib/content';

// Placeholder media block — real case stills come from Vadim later. Mirrors the
// portfolio's empty-image treatment (faint framed icon on a near-black panel).
function ImgPlaceholder({ minH = 240 }: { minH?: number }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-[6px] bg-white/[0.03]"
      style={{ minHeight: minH }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </div>
  );
}

// Fixed side panel with project meta (mono), pinned to the right edge of the
// 1100px column. Fades out once the CTA scrolls into view (atCta), like the
// portfolio's notes panel.
function NotesPanel({ item, atCta }: { item: CaseItem; atCta: boolean }) {
  const rows = [
    { k: 'Клиент', v: item.client },
    { k: 'Направление', v: item.category },
    { k: 'Что делали', v: item.tags.join(' · ') },
  ];
  return (
    <div
      className={`fixed top-0 z-10 hidden h-screen w-[220px] flex-col pb-10 pt-24 transition-opacity duration-500 lg:flex ${
        atCta ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ right: 'max(40px, calc((100vw - 1100px) / 2 + 10px))' }}
    >
      <p className="mb-4 font-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-inverted">
        Заметки
      </p>
      <div className="space-y-3 border-l border-white/10 pl-4">
        {rows.map((r) => (
          <div key={r.k}>
            <p className="font-mono text-[11px] uppercase tracking-[0.04em] text-inverted/30">{r.k}</p>
            <p className="font-mono text-[12px] leading-[1.4] text-inverted/70">{r.v}</p>
          </div>
        ))}
        {item.verified && (
          <p className="font-mono text-[12px] text-accent">✦ Подтверждённый кейс</p>
        )}
      </div>
    </div>
  );
}

export function CaseView({ item, others }: { item: CaseItem; others: CaseItem[] }) {
  const [atCta, setAtCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Hide the side notes once the CTA enters the viewport (room for the ask).
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtCta(e.isIntersecting), {
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

      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-10">
        <div className="pt-[116px] lg:pt-[140px]">
          <Link
            href="/#cases"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.02em] text-inverted/30 transition-colors hover:text-inverted/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Все кейсы
          </Link>
        </div>

        {/* radius/strength match the portfolio; pr leaves room for the notes panel */}
        <ScatterZone className="lg:pr-[252px]" radius={90} strength={14}>
          {/* HERO */}
          <section className="mb-12 pt-8">
            <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.05em] text-accent">
              {domainTag} · {methodTag}
            </p>
            <h1 className="mb-4 text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.03em] text-inverted">
              {item.client}
            </h1>
            <p className="mb-10 max-w-[560px] font-mono text-[clamp(14px,1vw,16px)] leading-[1.85] tracking-[-0.02em] text-inverted/45">
              {item.story.summary}
            </p>

            <div className="flex flex-wrap gap-x-10 gap-y-6">
              {item.story.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-inverted">{m.value}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-[-0.02em] text-inverted/45">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 aspect-[16/9] overflow-hidden rounded-[6px]">
              <CaseCover id={item.id} client={item.client} variant="hero" />
            </div>
          </section>

          {/* NARRATIVE SECTIONS */}
          {item.story.sections.map((s) => (
            <div key={s.title}>
              <div className="mb-10 h-px w-full bg-white/10" />
              <section className="mb-10">
                <h2 className="mb-4 text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.15] tracking-[-0.02em] text-inverted">
                  {s.title}
                </h2>
                <p className="mb-8 max-w-[640px] font-mono text-[clamp(14px,0.95vw,15px)] leading-[1.9] tracking-[-0.02em] text-inverted/65">
                  {s.body}
                </p>
                <ImgPlaceholder minH={240} />
              </section>
            </div>
          ))}

          {/* CTA */}
          <div className="mb-10 h-px w-full bg-white/10" />
          <div ref={ctaRef} id="contacts">
            <button
              type="button"
              data-compose
              className="block w-full rounded-[6px] bg-white/[0.04] px-7 py-12 text-center transition-colors hover:bg-white/[0.06]"
            >
              <p className="mx-auto mb-6 max-w-[520px] font-mono text-[clamp(14px,0.95vw,16px)] leading-[1.7] tracking-[-0.02em] text-inverted/65">
                {ctaBanner.title}
              </p>
              <span className="font-mono text-[18px] tracking-[-0.02em] text-accent">{ctaBanner.cta} →</span>
            </button>
          </div>

          {/* OTHER CASES */}
          <section className="mt-16 pb-4">
            <div className="h-px w-full bg-white/10" />
            <p className="mb-6 pt-5 font-mono text-[13px] uppercase tracking-[0.04em] text-inverted/45">
              Другие кейсы
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {others.map((c) => (
                <Link key={c.id} href={`/cases/${c.id}`} className="group block">
                  <div className="h-[120px] overflow-hidden rounded-[3px]">
                    <CaseCover id={c.id} client={c.client} variant="card" className="transition-transform duration-500 group-hover:scale-[1.05]" />
                  </div>
                  <div className="py-[6px]">
                    <p className="font-mono text-[11px] font-semibold text-inverted">{c.client}</p>
                    <p className="font-mono text-[10px] text-inverted/30">{c.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScatterZone>
      </div>

      <Footer />
    </main>
  );
}
