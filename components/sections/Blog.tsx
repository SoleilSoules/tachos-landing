'use client';

import Image from 'next/image';

import { useReveal } from '@/hooks/useReveal';
import { asset } from '@/lib/asset';
import { posts, blogIntro, type Post } from '@/lib/content';

// Arrow "open" affordance. Per the reference it sits bottom-right inside a
// ROUNDED SQUARE with a faint fill — not a circular button. On hover the whole
// card lifts and the glyph nudges up-right; reduced-motion users get no nudge
// (handled by the .blog-arrow keyframe guard below).
function ArrowSquare({ onPeach }: { onPeach?: boolean }) {
  return (
    <span
      className={`blog-arrow grid size-[44px] shrink-0 place-items-center rounded-tag transition ${
        onPeach ? 'bg-black/[0.07] text-black/70' : 'bg-black/[0.05] text-black/55'
      }`}
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 12 12 4M12 4H5M12 4v7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// Tag pill + "date · read" meta row. .nums keeps the date/duration figures
// lining (lnum/pnum) so they read evenly next to the pill.
function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-[10px] text-[13px]">
      <span className="rounded-tag bg-black/[0.06] px-[12px] py-[5px] font-medium text-black/70">
        {post.tag}
      </span>
      <span className="nums text-black/40">
        {post.date} · {post.read}
      </span>
    </div>
  );
}

// Bottom-left byline: round avatar + name / role. The avatar reuses the shared
// case-avatar placeholder (real per-author photo comes from Vadim later).
function Author({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="relative size-[38px] shrink-0 overflow-hidden rounded-full bg-black/10">
        <Image
          src={asset('/figma/founder-container.jpg')}
          alt={post.author}
          fill
          sizes="38px"
          className="object-cover"
        />
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-medium text-black">{post.author}</span>
        <span className="block text-[12px] text-black/45">{post.authorRole}</span>
      </span>
    </div>
  );
}

// Placeholder of the monte GTR drift device — a dark control panel with a
// "TAP TO ADD GAUGE" grid, matching the reference. Pure markup so the card has
// visible content before Vadim supplies the real device photo.
function DevicePlaceholder() {
  return (
    <div className="relative mt-[22px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2b2b30] to-[#161619] p-[18px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]">
      <div className="mb-[14px] flex items-center justify-between text-[11px]">
        <span className="font-semibold tracking-wide text-white/85">monte GTR</span>
        <span className="text-white/35">◀ ▶</span>
      </div>
      <div className="grid grid-cols-3 gap-[8px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[44px] flex-col justify-center rounded-[8px] bg-white/[0.06] px-[8px] text-[8px] leading-[1.25] text-white/40"
          >
            <span>TAP TO ADD</span>
            <span className="text-accent-bright">GAUGE</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// One blog card. `big` = full-width hero card (larger title/padding); `peach` =
// the warm accent card that also carries the device image.
function PostCard({ post, big, peach }: { post: Post; big?: boolean; peach?: boolean }) {
  return (
    <article
      tabIndex={0}
      className={`reveal-hidden group flex h-full cursor-pointer flex-col rounded-card transition duration-300 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        big ? 'p-[34px]' : 'p-[28px]'
      } ${
        peach
          ? 'bg-gradient-to-br from-[#f7d8c5] via-[#f6cdba] to-[#f1bda3]'
          : 'bg-surface hover:bg-surface2'
      }`}
    >
      <h3
        className={`font-semibold leading-[1.12] tracking-[-0.01em] text-black ${
          big ? 'max-w-[560px] text-[34px]' : 'max-w-[300px] text-[22px]'
        }`}
      >
        {post.title}
      </h3>

      <div className="mt-[16px]">
        <Meta post={post} />
      </div>

      {/* Peach card carries the device; it grows so the byline pins to the bottom. */}
      {peach && (
        <div className="flex flex-1 flex-col justify-end">
          <DevicePlaceholder />
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-[16px] pt-[26px]">
        <Author post={post} />
        <ArrowSquare onPeach={peach} />
      </div>
    </article>
  );
}

export function Blog() {
  // Layout per reference: one wide hero card on top, then two cards side-by-side
  // (left light, right peach). posts is a fixed 3-tuple from content.ts.
  const [hero, left, right] = posts;
  const ref = useReveal<HTMLDivElement>({ stagger: 90, threshold: 0.1 });

  return (
    <section id="blog" className="bg-white pt-[120px] pb-[140px]">
      {/* WHY scoped <style>: keep the hover-arrow nudge here (blog- prefix) and
          neutralise it under reduced-motion so the section ships no global CSS. */}
      <style>{`
        .blog-arrow svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .group:hover .blog-arrow svg,
        .group:focus-visible .blog-arrow svg { transform: translate(2px, -2px); }
        @media (prefers-reduced-motion: reduce) {
          .group:hover .blog-arrow svg,
          .group:focus-visible .blog-arrow svg { transform: none; }
        }
      `}</style>

      <div className="mx-auto max-w-[680px] px-6 text-center">
        <h2 className="text-[52px] font-semibold leading-[1.0] tracking-[-0.02em] text-fg">
          {blogIntro.title}
        </h2>
        <p className="mx-auto mt-[20px] max-w-[540px] text-[19px] leading-[1.4] text-black/45">
          {blogIntro.body}
        </p>
      </div>

      <div ref={ref} className="mx-auto mt-[56px] flex max-w-page flex-col gap-[24px] px-[80px]">
        <PostCard post={hero} big />
        <div className="grid grid-cols-2 gap-[24px]">
          <PostCard post={left} />
          <PostCard post={right} peach />
        </div>
      </div>
    </section>
  );
}
