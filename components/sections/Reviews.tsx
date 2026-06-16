'use client';

import Image from 'next/image';
import { asset } from '@/lib/asset';
import { useReveal } from '@/hooks/useReveal';
import { reviews, type Review } from '@/lib/content';

function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 16" fill="none" aria-hidden>
      <path d="M1 1.5 12.5 8 1 14.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

// Orange glow blobs inside a card, standing in for the Figma gradient ellipses.
function Glow({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full bg-accent/30 blur-[70px] ${className}`}
    />
  );
}

function Avatar({ src, size = 54 }: { src: string; size?: number }) {
  return (
    <span className="shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image src={src} alt="" width={size} height={size} className="size-full object-cover" />
    </span>
  );
}

function Author({ r, light }: { r: Review; light?: boolean }) {
  return (
    <div className="flex items-center gap-[10px]">
      <Avatar src={asset('/figma/rev-avatar.png')} />
      <div className="leading-tight">
        <div className={`text-[16px] tracking-[0.03em] ${light ? 'text-[#05010d]' : 'text-white'}`}>
          {r.author}
        </div>
        <div className={`text-[14px] ${light ? 'text-black/50' : 'text-white/50'}`}>{r.role}</div>
      </div>
    </div>
  );
}

// Static waveform: a run of accent bars (played) then muted grey bars.
const WAVE = [19, 14, 8, 8, 8, 8, 14, 14, 24, 17, 30, 14, 8, 17, 8, 8, 14, 14, 30, 17, 27, 30, 14, 8, 8, 14, 14, 30, 17, 27, 30, 14, 5, 8, 8, 8, 8, 30, 24, 17, 22, 30, 24, 17, 22, 14, 8, 8, 17, 22, 30, 22, 14, 8, 14, 8];

function AudioCard({ r }: { r: Review }) {
  return (
    <div className="reveal-hidden relative h-[360px] w-[630px] max-w-full overflow-hidden rounded-[40px] border border-[#8d8d8d]/40 bg-black/15 p-[36px] backdrop-blur-xl">
      <Glow className="-left-[60px] top-[180px] h-[260px] w-[260px]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <Author r={r} />
          <span className="size-[58px] shrink-0 rounded-full bg-white/20" />
        </div>
        <p className="text-[22px] font-medium leading-[1.25] text-[#f5f7f6]">{r.text}</p>
        <div className="flex h-[80px] items-center gap-[10px] rounded-full bg-white/10 p-[10px]">
          <button
            type="button"
            aria-label="Воспроизвести"
            className="grid size-[60px] shrink-0 place-items-center rounded-full bg-accent text-white"
          >
            <PlayIcon size={22} />
          </button>
          <div className="flex flex-1 items-center gap-[3px] overflow-hidden">
            {WAVE.map((h, i) => (
              <span
                key={i}
                style={{ height: h }}
                className={`w-[3px] shrink-0 rounded-full ${i < 10 ? 'bg-accent' : 'bg-[#c8c8c8]/40'}`}
              />
            ))}
          </div>
          <span className="shrink-0 px-[8px] text-[14px] text-white/60">{r.duration}</span>
        </div>
      </div>
    </div>
  );
}

function TextCard({ r }: { r: Review }) {
  const light = r.tone === 'light';
  return (
    <div
      className={`reveal-hidden relative h-[502px] w-full overflow-hidden rounded-[40px] p-[36px] backdrop-blur-xl ${
        light
          ? 'border border-[#8d8d8d]/30 bg-gradient-to-b from-[#af9897] via-[#cddcdd] to-[#f05138] text-[#05010d]'
          : 'border border-[#8d8d8d]/40 bg-black/15 text-white'
      }`}
    >
      {!light && <Glow className="-left-[40px] -top-[120px] h-[300px] w-[300px]" />}
      {!light && <Glow className="bottom-[40px] right-[20px] h-[200px] w-[200px] bg-accent/20" />}
      <div className="relative flex h-full flex-col justify-between">
        <p className="text-[22px] font-medium leading-[1.2]">{r.text}</p>
        <Author r={r} light={light} />
      </div>
    </div>
  );
}

// Video testimonial — warm orange card with a portrait still behind it.
function VideoCard({ r }: { r: Review }) {
  return (
    <div className="reveal-hidden group relative h-[502px] w-full overflow-hidden rounded-[40px] p-[36px] text-white">
      <Image
        src={asset('/figma/founder-isaac.png')}
        alt=""
        fill
        sizes="400px"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-accent/40 to-accent" />
      {/* big round play in the centre — Vadim: the play should sit on a circle,
          reading clearly as a video object */}
      <button
        type="button"
        aria-label="Смотреть видео-отзыв"
        className="absolute left-1/2 top-1/2 grid size-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-accent shadow-[0_16px_44px_rgba(0,0,0,0.38)] backdrop-blur-md transition group-hover:scale-105"
      >
        <PlayIcon size={26} />
      </button>
      <div className="relative flex h-full flex-col justify-end">
        <p className="text-[26px] font-medium leading-[1.15]">
          {r.author}
          <br />
          <span className="text-white/60">{r.caption}</span>
        </p>
        <div className="mt-[8px] text-[16px] leading-[1.3] text-white/85">{r.role}</div>
      </div>
    </div>
  );
}

// Portrait testimonial (Дарья) — round photo in an accent ring.
function PortraitCard({ r }: { r: Review }) {
  return (
    <div className="reveal-hidden relative flex h-[520px] w-[402px] max-w-full flex-col items-center justify-center gap-[28px] overflow-hidden rounded-[40px] border border-[#8d8d8d]/30 bg-white/[0.06] p-[36px] text-center backdrop-blur-xl">
      <Glow className="left-[55px] top-[40px] h-[290px] w-[290px] bg-accent/20" />
      <span className="absolute left-[36px] top-[36px] grid size-[40px] place-items-center rounded-full bg-white/10 text-white/70">
        <PlayIcon size={14} />
      </span>
      <div className="relative size-[290px] overflow-hidden rounded-full ring-2 ring-accent/70">
        <Image src={asset('/figma/founder-jennifer.png')} alt="" fill sizes="290px" className="object-cover" />
      </div>
      <div className="relative">
        <p className="text-[26px] font-medium leading-[1.2] text-[#f5f7f6]">
          {r.author}
          <br />
          <span className="text-white/50">{r.caption}</span>
        </p>
        <p className="mt-[16px] text-[16px] leading-[1.3] text-white/40">{r.role}</p>
      </div>
    </div>
  );
}

export function Reviews() {
  const ref = useReveal<HTMLDivElement>({ stagger: 90, threshold: 0.05 });
  const [audio, t1, v1, t2, v2] = reviews.items;

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#05010d] pb-[160px] pt-[120px] text-white">
      {/* starfield + soft accent bloom — Vadim: the bg felt empty, wanted some "космос" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 12% 16%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 31% 58%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1.5px 1.5px at 57% 26%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 77% 70%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 88% 36%, rgba(255,255,255,0.55), transparent),
            radial-gradient(1.5px 1.5px at 44% 86%, rgba(255,255,255,0.5), transparent)
          `,
          backgroundSize: '340px 340px',
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-[6%] h-[540px] w-[840px] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[170px]" aria-hidden />
      <div className="pointer-events-none absolute -right-[140px] bottom-[14%] h-[420px] w-[420px] rounded-full bg-accent/[0.10] blur-[150px]" aria-hidden />

      <div className="relative mx-auto max-w-[861px] px-6 text-center">
        <h2 className="text-[52px] font-semibold leading-[0.9] tracking-[-0.02em]">{reviews.title}</h2>
        <p className="mx-auto mt-[28px] max-w-[320px] text-[19px] leading-[1.4] text-white/75">
          {reviews.subtitle}
        </p>
      </div>

      <div ref={ref} className="relative mx-auto mt-[56px] flex max-w-[900px] flex-col items-center gap-[40px] px-6">
        <AudioCard r={audio} />
        <div className="grid w-full max-w-[824px] grid-cols-1 gap-[40px] md:grid-cols-2">
          <TextCard r={t1} />
          <VideoCard r={v1} />
        </div>
        <div className="w-[590px] max-w-full self-start md:ml-[40px]">
          <TextCard r={t2} />
        </div>
        <PortraitCard r={v2} />
      </div>
    </section>
  );
}
