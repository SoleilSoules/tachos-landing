'use client';

import { useReveal } from '@/hooks/useReveal';
import { posts, blogIntro, type Post } from '@/lib/content';

function ArrowBadge({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`grid size-[44px] place-items-center rounded-full transition group-hover:rotate-45 ${
        dark ? 'bg-black/10 text-black' : 'bg-black/[0.06] text-black/60'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
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

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[10px] text-[13px]">
      <span className="rounded-pill bg-black/[0.06] px-[12px] py-[5px] font-medium text-black/70">
        {post.tag}
      </span>
      <span className="text-black/40">
        {post.date} • {post.read}
      </span>
    </div>
  );
}

function Author({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="grid size-[36px] place-items-center rounded-full bg-black/10 text-[14px] font-semibold text-black/70">
        {post.author[0]}
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-medium text-black">{post.author}</span>
        <span className="block text-[12px] text-black/45">{post.authorRole}</span>
      </span>
    </div>
  );
}

// Placeholder of the monte GTR drift device — a dark panel with a control grid
// on a warm backdrop, until Vadim supplies the real photo.
function DevicePlaceholder() {
  return (
    <div className="relative mt-[20px] flex-1 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2a2a2e] to-[#16161a] p-[18px]">
      <div className="mb-[12px] flex items-center justify-between text-[11px] text-white/50">
        <span className="font-semibold tracking-wide text-white/80">monte GTR</span>
        <span>◀ ▶</span>
      </div>
      <div className="grid grid-cols-3 gap-[8px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[42px] flex-col justify-center rounded-[8px] bg-white/[0.06] px-[8px] text-[8px] text-white/40"
          >
            <span>TAP TO ADD</span>
            <span className="text-accent-bright">GAUGE</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, big, image }: { post: Post; big?: boolean; image?: boolean }) {
  return (
    <article
      className={`reveal-hidden group flex h-full cursor-pointer flex-col rounded-[28px] p-[28px] transition hover:-translate-y-[2px] ${
        image
          ? 'bg-gradient-to-br from-[#f7d9c6] via-[#f6cdbb] to-[#f3bfa6]'
          : 'bg-surface hover:bg-surface2'
      } ${big ? 'min-h-[260px]' : 'min-h-[220px]'}`}
    >
      <h3
        className={`font-semibold leading-[1.15] tracking-[-0.01em] text-black ${
          big ? 'text-[26px]' : 'text-[20px]'
        } max-w-[300px]`}
      >
        {post.title}
      </h3>
      <div className="mt-[14px]">
        <Meta post={post} />
      </div>

      {image && <DevicePlaceholder />}

      <div className="mt-auto flex items-end justify-between pt-[24px]">
        <Author post={post} />
        <ArrowBadge dark={image} />
      </div>
    </article>
  );
}

export function Blog() {
  const [a, b, c] = posts;
  const ref = useReveal<HTMLDivElement>({ stagger: 80, threshold: 0.1 });

  return (
    <section id="blog" className="bg-white pt-[120px] pb-[140px]">
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <h2 className="text-[52px] font-semibold leading-[1.0] tracking-[-0.02em] text-fg">
          {blogIntro.title}
        </h2>
        <p className="mx-auto mt-[20px] max-w-[520px] text-[15px] leading-[1.4] text-black/45">
          {blogIntro.body}
        </p>
      </div>

      <div ref={ref} className="mx-auto mt-[56px] grid max-w-page grid-cols-2 gap-[24px] px-[80px]">
        <div className="flex flex-col gap-[24px]">
          <PostCard post={a} big />
          <PostCard post={b} />
        </div>
        <PostCard post={c} image />
      </div>
    </section>
  );
}
