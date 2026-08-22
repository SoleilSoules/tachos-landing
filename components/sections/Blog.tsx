'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';
import { WordsReveal } from '@/components/WordsReveal';
import { asset } from '@/lib/asset';
import { posts, blogIntro, type Post } from '@/lib/content';

function ArrowSquare({ small = false, onPeach = false }: { small?: boolean; onPeach?: boolean }) {
  return (
    <span
      className={`blog-arrow grid shrink-0 place-items-center transition ${
        small ? 'size-[44px] rounded-[14px]' : 'size-[52px] rounded-[17px]'
      } ${onPeach ? 'bg-black/[0.07] text-black/55' : 'bg-black/[0.05] text-black/55'}`}
      aria-hidden
    >
      <svg width={small ? 15 : 16} height={small ? 15 : 16} viewBox="0 0 16 16" fill="none">
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

// Tag as a solid white pill, date/read as a muted one — the pair reads as a
// single meta line above the title.
function Pills({
  post,
  peach,
  withRead = true,
}: {
  post: Post;
  peach?: boolean;
  withRead?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[8px] text-[14px]">
      <span className="rounded-full bg-white px-[14px] py-[6px] font-medium text-black shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
        {post.tag}
      </span>
      <span
        className={`nums rounded-full px-[14px] py-[6px] ${
          peach ? 'bg-white/50 text-black/55' : 'bg-black/[0.05] text-black/45'
        }`}
      >
        {withRead ? `${post.date} · ${post.read}` : post.date}
      </span>
    </div>
  );
}

function Author({ post, size = 48 }: { post: Post; size?: number }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span
        className="relative shrink-0 overflow-hidden rounded-full bg-black/10"
        style={{ width: size, height: size }}
      >
        <Image
          src={asset('/figma/founder-container.jpg')}
          alt={post.author}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] tracking-[0.02em] text-black">{post.author}</span>
        <span className="block text-[13px] text-black/45">{post.authorRole}</span>
      </span>
    </div>
  );
}

const CARD_BASE =
  'reveal-hidden group flex cursor-pointer flex-col overflow-hidden transition duration-300 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

// Lead story: cover photo across the full card width, copy beneath it.
function LeadCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-hint="blog"
      data-hint-sub={post.slug}
      className={`${CARD_BASE} rounded-[28px] bg-surface hover:bg-surface2 sm:rounded-[32px]`}
    >
      {post.cover && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={asset(post.cover)}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 700px"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-[16px] p-[24px] sm:p-[34px]">
        <Pills post={post} />
        <h3 className="text-[24px] font-semibold leading-[1.12] tracking-[-0.015em] text-black sm:text-[31px]">
          {post.title}
        </h3>
        <p className="text-[15px] leading-[1.45] text-black/50">{post.excerpt}</p>
        <div className="mt-auto flex items-end justify-between gap-[16px] pt-[12px]">
          <Author post={post} />
          <span className="flex items-center gap-[12px]">
            <span className="text-[15px] font-medium text-black/55">{blogIntro.readCta}</span>
            <ArrowSquare />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Side stories: no cover, copy top / author bottom. `inset` drops a product shot
// into the card's lower-right corner (the peach Новость card).
function MiniCard({ post, peach = false }: { post: Post; peach?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-hint="blog"
      data-hint-sub={post.slug}
      className={`${CARD_BASE} relative min-h-[240px] flex-1 justify-between gap-[20px] rounded-[24px] p-[24px] sm:rounded-[26px] sm:p-[26px] ${
        peach ? 'bg-gradient-to-br from-[#f7d8c5] to-[#f1bda3]' : 'bg-surface hover:bg-surface2'
      }`}
    >
      <div className="relative z-10 flex flex-col gap-[14px]">
        <Pills post={post} peach={peach} withRead={false} />
        <h3 className="max-w-[15ch] text-[20px] font-semibold leading-[1.2] tracking-[-0.01em] text-black sm:text-[21px]">
          {post.title}
        </h3>
        {!post.inset && <p className="text-[15px] leading-[1.45] text-black/50">{post.excerpt}</p>}
      </div>
      {post.inset && (
        // Bleeds off the right-bottom corner so the card keeps its copy width.
        <Image
          src={asset(post.inset)}
          alt=""
          width={420}
          height={260}
          aria-hidden
          className="pointer-events-none absolute -bottom-[14px] -right-[34px] w-[52%] object-contain"
        />
      )}
      <div className="relative z-10 flex items-end justify-between gap-[14px]">
        <Author post={post} size={42} />
        <ArrowSquare small onPeach={peach} />
      </div>
    </Link>
  );
}

export function Blog() {
  const [lead, side1, side2] = posts;
  const ref = useReveal<HTMLDivElement>({ stagger: 90, threshold: 0.1 });
  if (!lead || !side1 || !side2) return null;

  return (
    <section id="blog" className="bg-white pb-[56px] pt-[48px] lg:pb-[140px] lg:pt-[120px]">
      <style>{`
        .blog-arrow svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .group:hover .blog-arrow svg, .group:focus-visible .blog-arrow svg { transform: translate(2px,-2px); }
        @media (prefers-reduced-motion: reduce) {
          .group:hover .blog-arrow svg, .group:focus-visible .blog-arrow svg { transform: none; }
          .group:hover img { transform: none; }
        }
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

      {/* lead story takes the wider column; the two side stories stack beside it */}
      <div
        ref={ref}
        className="mx-auto mt-[36px] grid max-w-[1180px] grid-cols-1 gap-[20px] px-6 sm:mt-[56px] sm:gap-[26px] lg:grid-cols-[1.35fr_1fr]"
      >
        <LeadCard post={lead} />
        <div className="flex flex-col gap-[20px] sm:gap-[26px]">
          <MiniCard post={side1} />
          <MiniCard post={side2} peach />
        </div>
      </div>
    </section>
  );
}
