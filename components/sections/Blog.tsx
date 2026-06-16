'use client';

import Image from 'next/image';
import { useReveal } from '@/hooks/useReveal';
import { asset } from '@/lib/asset';
import { posts, blogIntro, type Post } from '@/lib/content';

// Short teasers per post (kept local — content.ts has no excerpt field yet).
const EXCERPTS = [
  'Собрали и зарелизили мерж-игру для бренда «Добрый» — от концепта до публикации за месяц.',
  'Как доводим смелые идеи до прода без бесконечных переносов сроков и переделок.',
  'Спроектировали и собрали железку monte GTR: телеметрия и тюнинг в одном корпусе.',
];

function ArrowSquare({ onPeach }: { onPeach?: boolean }) {
  return (
    <span
      className={`blog-arrow grid size-[46px] shrink-0 place-items-center rounded-[14px] transition ${
        onPeach ? 'bg-black/[0.08] text-black/70' : 'bg-black/[0.05] text-black/55'
      }`}
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 12 12 4M12 4H5M12 4v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-[10px] text-[13px]">
      <span className="rounded-tag bg-black/[0.06] px-[12px] py-[5px] font-medium text-black/70">{post.tag}</span>
      <span className="nums text-black/40">
        {post.date} · {post.read}
      </span>
    </div>
  );
}

function Author({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="relative size-[40px] shrink-0 overflow-hidden rounded-full bg-black/10">
        <Image src={asset('/figma/founder-container.jpg')} alt={post.author} fill sizes="40px" className="object-cover" />
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-medium text-black">{post.author}</span>
        <span className="block text-[12px] text-black/45">{post.authorRole}</span>
      </span>
    </div>
  );
}

// Warm gradient preview block for the hero card — fills the empty right side
// with a branded visual + an oversized watermark tag instead of dead space.
function HeroVisual({ label }: { label: string }) {
  return (
    <div className="relative hidden overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f7d8c5] via-[#f4b89b] to-[#ee9f78] md:block">
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_75%_25%,rgba(240,81,56,0.35),transparent_70%)]" />
      <span className="absolute bottom-[-10px] left-[24px] text-[96px] font-bold leading-none tracking-tight text-white/25">
        {label}
      </span>
      <span className="absolute right-[26px] top-[24px] rounded-full bg-black/15 px-[14px] py-[7px] text-[13px] font-medium text-black/70 backdrop-blur-sm">
        tachos blog
      </span>
    </div>
  );
}

// Clean monte GTR device — a dark rounded slab with the brand line and a couple
// of subtle gauge dials (replaces the ugly "TAP TO ADD GAUGE" grid).
function DeviceMock() {
  return (
    <div className="relative mt-[20px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#2c2c31] to-[#141417] p-[20px] shadow-[0_22px_50px_-18px_rgba(0,0,0,0.55)]">
      <div className="mb-[16px] flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[0.08em] text-white/85">monte GTR</span>
        <span className="size-[8px] rounded-full bg-accent-bright shadow-[0_0_10px_rgba(255,82,44,0.8)]" />
      </div>
      <div className="flex gap-[14px]">
        {[
          { v: '0.8', l: 'BOOST' },
          { v: '94°', l: 'OIL' },
          { v: '6200', l: 'RPM' },
        ].map((g) => (
          <div key={g.l} className="flex-1 rounded-[14px] bg-white/[0.05] px-[12px] py-[14px]">
            <div className="nums text-[20px] font-semibold text-white">{g.v}</div>
            <div className="mt-[2px] text-[10px] tracking-[0.12em] text-accent-bright">{g.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmallCard({ post, excerpt, peach }: { post: Post; excerpt: string; peach?: boolean }) {
  return (
    <article
      tabIndex={0}
      className={`reveal-hidden group flex h-full cursor-pointer flex-col rounded-card p-[32px] transition duration-300 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        peach ? 'bg-gradient-to-br from-[#f7d8c5] via-[#f6cdba] to-[#f1bda3]' : 'bg-surface hover:bg-surface2'
      }`}
    >
      <Meta post={post} />
      <h3 className="mt-[16px] max-w-[340px] text-[24px] font-semibold leading-[1.12] tracking-[-0.01em] text-black">
        {post.title}
      </h3>
      <p className="mt-[12px] max-w-[360px] text-[15px] leading-[1.45] text-black/55">{excerpt}</p>
      {peach && (
        <div className="flex flex-1 flex-col justify-end">
          <DeviceMock />
        </div>
      )}
      <div className="mt-auto flex items-end justify-between gap-[16px] pt-[28px]">
        <Author post={post} />
        <ArrowSquare onPeach={peach} />
      </div>
    </article>
  );
}

export function Blog() {
  const [hero, left, right] = posts;
  const ref = useReveal<HTMLDivElement>({ stagger: 90, threshold: 0.1 });

  return (
    <section id="blog" className="bg-white pb-[140px] pt-[120px]">
      <style>{`
        .blog-arrow svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .group:hover .blog-arrow svg, .group:focus-visible .blog-arrow svg { transform: translate(2px,-2px); }
        @media (prefers-reduced-motion: reduce) { .group:hover .blog-arrow svg, .group:focus-visible .blog-arrow svg { transform: none; } }
      `}</style>

      <div className="mx-auto max-w-[680px] px-6 text-center">
        <h2 className="text-[52px] font-semibold leading-[1.0] tracking-[-0.02em] text-fg">{blogIntro.title}</h2>
        <p className="mx-auto mt-[20px] max-w-[540px] text-[19px] leading-[1.4] text-black/45">{blogIntro.body}</p>
      </div>

      <div ref={ref} className="mx-auto mt-[56px] flex max-w-page flex-col gap-[24px] px-[80px]">
        {/* hero card — two columns: text left, warm visual right (no dead space) */}
        <article
          tabIndex={0}
          className="reveal-hidden group grid cursor-pointer grid-cols-1 gap-[28px] rounded-card bg-surface p-[34px] transition duration-300 hover:-translate-y-[3px] hover:bg-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 md:grid-cols-[1fr_0.92fr] md:p-[40px]"
        >
          <div className="flex flex-col justify-between">
            <div>
              <Meta post={hero} />
              <h3 className="mt-[18px] max-w-[420px] text-[34px] font-semibold leading-[1.08] tracking-[-0.01em] text-black">
                {hero.title}
              </h3>
              <p className="mt-[16px] max-w-[420px] text-[16px] leading-[1.5] text-black/55">{EXCERPTS[0]}</p>
            </div>
            <div className="mt-[28px] flex items-end justify-between gap-[16px]">
              <Author post={hero} />
              <ArrowSquare />
            </div>
          </div>
          <HeroVisual label="Добрый" />
        </article>

        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
          <SmallCard post={left} excerpt={EXCERPTS[1]} />
          <SmallCard post={right} excerpt={EXCERPTS[2]} peach />
        </div>
      </div>
    </section>
  );
}
