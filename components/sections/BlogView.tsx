'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ScatterZone } from '@/components/ScatterZone';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { ctaBanner, type Post } from '@/lib/content';

// Fixed side panel with post meta (mono), pinned to the right edge of the column.
// Fades out at the CTA, like the case page.
function MetaPanel({ post, atCta }: { post: Post; atCta: boolean }) {
  const rows = [
    { k: 'Автор', v: `${post.author} · ${post.authorRole}` },
    { k: 'Дата', v: post.date },
    { k: 'Чтение', v: post.read },
    { k: 'Раздел', v: post.tag },
  ];
  return (
    <div
      className={`fixed top-0 z-10 hidden h-screen w-[220px] flex-col pb-10 pt-24 transition-opacity duration-500 lg:flex ${
        atCta ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ right: 'max(40px, calc((100vw - 1100px) / 2 + 10px))' }}
    >
      <p className="mb-4 font-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-inverted">
        О статье
      </p>
      <div className="space-y-3 border-l border-white/10 pl-4">
        {rows.map((r) => (
          <div key={r.k}>
            <p className="font-mono text-[11px] uppercase tracking-[0.04em] text-inverted/30">{r.k}</p>
            <p className="font-mono text-[12px] leading-[1.4] text-inverted/70">{r.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogView({ post, others }: { post: Post; others: Post[] }) {
  const [atCta, setAtCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtCta(e.isIntersecting), {
      rootMargin: '0px 0px -40% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-bg text-inverted [animation:fade-in_0.4s_ease-out]">
      <Nav />
      <MetaPanel post={post} atCta={atCta} />

      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-10">
        <div className="pt-[116px] lg:pt-[140px]">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.02em] text-inverted/30 transition-colors hover:text-inverted/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Назад
          </Link>
        </div>

        <ScatterZone className="lg:pr-[252px]" radius={90} strength={12}>
          {/* HERO */}
          <section className="mb-12 pt-8">
            <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.05em] text-accent">{post.tag}</p>
            <h1 className="mb-5 max-w-[760px] text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.03em] text-inverted">
              {post.title}
            </h1>
            <p className="mb-6 max-w-[620px] text-[clamp(17px,1.3vw,21px)] leading-[1.5] text-inverted/55">
              {post.excerpt}
            </p>
            <p className="font-mono text-[12px] tracking-[-0.02em] text-inverted/35">
              {post.date} · {post.read} · {post.author}
            </p>

            <div className="mt-8 flex items-center justify-center overflow-hidden rounded-[6px] bg-white/[0.03]" style={{ minHeight: 360 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
          </section>

          {/* BODY — readable Onest, mono only for meta/labels */}
          <article className="mb-12 max-w-[680px]">
            {post.body.map((b, i) => {
              if (b.type === 'h') {
                return (
                  <h2 key={i} className="mb-4 mt-12 text-[clamp(20px,2.2vw,26px)] font-semibold leading-[1.2] tracking-[-0.02em] text-inverted">
                    {b.text}
                  </h2>
                );
              }
              if (b.type === 'quote') {
                return (
                  <blockquote key={i} className="my-10 border-l-2 border-accent pl-6 text-[clamp(20px,2.2vw,26px)] font-medium leading-[1.4] tracking-[-0.01em] text-inverted/90">
                    {b.text}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="mb-6 text-[clamp(16px,1.2vw,19px)] leading-[1.7] text-inverted/70">
                  {b.text}
                </p>
              );
            })}
          </article>

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

          {/* OTHER POSTS */}
          {others.length > 0 && (
            <section className="mt-16 pb-4">
              <div className="h-px w-full bg-white/10" />
              <p className="mb-6 pt-5 font-mono text-[13px] uppercase tracking-[0.04em] text-inverted/45">
                Ещё в блоге
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {others.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group block rounded-[6px] bg-white/[0.04] px-5 py-5 transition-colors hover:bg-white/[0.07]">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.04em] text-accent">{p.tag}</p>
                    <p className="text-[18px] font-semibold leading-[1.2] tracking-[-0.01em] text-inverted">{p.title}</p>
                    <p className="mt-2 font-mono text-[11px] text-inverted/30">{p.date} · {p.read}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </ScatterZone>
      </div>

      <Footer />
    </main>
  );
}
