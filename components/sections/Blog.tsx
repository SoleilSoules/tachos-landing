'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';
import { WordsReveal } from '@/components/WordsReveal';
import { asset } from '@/lib/asset';
import { posts, blogIntro, type Post } from '@/lib/content';

function ArrowSquare({ onPeach }: { onPeach?: boolean }) {
  return (
    <span
      className={`blog-arrow grid size-[56px] shrink-0 place-items-center rounded-[18px] transition ${
        onPeach ? 'bg-black/[0.06] text-black/60' : 'bg-black/[0.05] text-black/55'
      }`}
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 12 12 4M12 4H5M12 4v7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// Meta sits UNDER the title (Figma): type as a white pill, date/read as a light pill.
function Meta({ post, peach }: { post: Post; peach?: boolean }) {
  return (
    <div className="mt-[16px] flex flex-wrap items-center gap-[8px] text-[14px]">
      <span className="rounded-full bg-white px-[14px] py-[6px] font-medium text-black shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
        {post.tag}
      </span>
      <span
        className={`nums rounded-full px-[14px] py-[6px] ${peach ? 'bg-white/45 text-black/55' : 'bg-black/[0.05] text-black/45'}`}
      >
        {post.date} · {post.read}
      </span>
    </div>
  );
}

// Author — same size as the review cards' author (54px avatar, 16/14 text). (#3)
function Author({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="relative size-[54px] shrink-0 overflow-hidden rounded-full bg-black/10">
        <Image
          src={asset('/figma/founder-container.jpg')}
          alt={post.author}
          fill
          sizes="54px"
          className="object-cover"
        />
      </span>
      <span className="leading-tight">
        <span className="block text-[16px] tracking-[0.03em] text-black">{post.author}</span>
        <span className="block text-[14px] text-black/45">{post.authorRole}</span>
      </span>
    </div>
  );
}

// Photo block (real device photo). `bleed` pushes it off the right card edge by
// ~half (#2) — used on the peach card.
function PhotoBlock({ src, bleed }: { src: string; bleed?: boolean }) {
  return (
    <div
      className={`relative mt-[20px] aspect-[16/10] overflow-hidden rounded-[22px] ${
        bleed ? 'w-[142%] translate-x-[24%]' : 'w-full'
      }`}
    >
      <Image
        src={asset(src)}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 560px"
        className="object-cover"
      />
    </div>
  );
}

// Title on top → meta under it → content stretches → author + arrow pinned to the
// bottom. `big` = the full-width hero card; `peach` = the warm Новость card.
function Card({
  post,
  big = false,
  peach = false,
  children,
}: {
  post: Post;
  big?: boolean;
  peach?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-hint="Статья студии"
      data-hint-sub={post.tag}
      className={`reveal-hidden group flex h-full cursor-pointer flex-col overflow-hidden rounded-card transition duration-300 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        peach
          ? 'bg-gradient-to-br from-[#f7d8c5] via-[#f6cdba] to-[#f1bda3]'
          : 'bg-surface hover:bg-surface2'
      } ${big ? 'min-h-[500px] p-[28px] sm:p-[40px] md:p-[44px]' : 'min-h-[380px] p-[24px] sm:p-[34px]'}`}
    >
      <h3
        className={`font-semibold leading-[1.1] tracking-[-0.01em] text-black ${
          big
            ? 'max-w-[560px] text-[26px] sm:text-[34px]'
            : 'max-w-[300px] text-[22px] sm:text-[26px]'
        }`}
      >
        {post.title}
      </h3>
      <Meta post={post} peach={peach} />
      {children && <div className="flex flex-1 flex-col justify-end">{children}</div>}
      <div className="mt-auto flex items-end justify-between gap-[16px] pt-[28px]">
        <Author post={post} />
        <ArrowSquare onPeach={peach} />
      </div>
    </Link>
  );
}

export function Blog() {
  const [hero, left, right] = posts;
  const ref = useReveal<HTMLDivElement>({ stagger: 90, threshold: 0.1 });
  if (!hero || !left || !right) return null;

  return (
    <section id="blog" className="bg-white pb-[72px] pt-[64px] lg:pb-[140px] lg:pt-[120px]">
      <style>{`
        .blog-arrow svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .group:hover .blog-arrow svg, .group:focus-visible .blog-arrow svg { transform: translate(2px,-2px); }
        @media (prefers-reduced-motion: reduce) { .group:hover .blog-arrow svg, .group:focus-visible .blog-arrow svg { transform: none; } }
      `}</style>

      <div className="mx-auto max-w-[680px] px-6 text-center">
        <WordsReveal
          as="h2"
          stagger={48}
          className="text-[clamp(32px,9vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em] text-fg lg:leading-[1.0]"
        >
          {blogIntro.title}
        </WordsReveal>
        <WordsReveal
          as="p"
          stagger={20}
          start={240}
          className="mx-auto mt-[20px] block max-w-[640px] text-[19px] leading-[1.4] text-black/45"
        >
          {blogIntro.body}
        </WordsReveal>
      </div>

      <div ref={ref} className="mx-auto mt-[56px] flex max-w-[900px] flex-col gap-[40px] px-6">
        {/* hero card — full width, no photo (as before, #2) */}
        <Card post={hero} big />

        <div className="grid grid-cols-1 gap-[40px] md:grid-cols-2">
          <Card post={left} />
          <Card post={right} peach>
            <PhotoBlock src="/figma/monte-gtr.png" bleed />
          </Card>
        </div>
      </div>
    </section>
  );
}
