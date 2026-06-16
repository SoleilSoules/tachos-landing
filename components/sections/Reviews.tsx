'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { useReveal } from '@/hooks/useReveal';
import { reviews, type Review } from '@/lib/content';

// ─── Shared design tokens for the section ──────────────────────────────
// One source of truth so every card in the mosaic reads as one family:
// same 40px radius (rounded-card), same border colour/alpha, same padding.
const CARD_BORDER = 'border border-[#8d8d8d]/35';
const CARD_PAD = 'p-[36px]';
const GLASS = 'bg-black/15 backdrop-blur-md';

// Local copy that isn't worth promoting to content.ts (UI affordances only).
const COPY = {
  videoLabel: 'Смотреть видео-отзыв',
  seekLabel: 'Перемотать запись',
};

function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 16" fill="none" aria-hidden>
      <path d="M1 1.5 12.5 8 1 14.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="3.6" height="13" rx="1.2" fill="currentColor" />
      <rect x="8.9" y="1.5" width="3.6" height="13" rx="1.2" fill="currentColor" />
    </svg>
  );
}

// Handwritten "tachos" wordmark (from tachos-svg/tachos-14.svg). Inlined so it
// can inherit colour via currentColor — the source fill #111111 is replaced with
// `fill="currentColor"`, and callers set the colour through className (e.g.
// text-inverted/70). preserveAspectRatio keeps it centred when scaled into the
// round badge; the original transform group is kept verbatim so the glyph
// geometry is untouched.
function TachosMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1007 363.777373"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      <g
        transform="translate(-55.000000,400.887104) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        <path d="M9473 3998 c-13 -6 -23 -17 -23 -24 0 -19 55 -45 114 -54 28 -4 103 -18 166 -30 195 -36 278 -50 302 -50 13 0 50 -7 81 -15 51 -13 160 -24 430 -42 l77 -5 0 45 c0 25 -4 48 -9 51 -5 3 -60 6 -122 7 -63 1 -166 8 -230 15 -63 8 -162 19 -220 24 -211 21 -381 50 -429 75 -33 17 -104 19 -137 3z" />
        <path d="M5842 3728 c-7 -7 -12 -22 -12 -35 0 -13 -10 -29 -25 -39 -24 -16 -27 -15 -45 1 -18 17 -20 17 -26 1 -6 -15 -9 -15 -31 5 l-23 23 -22 -22 c-20 -19 -22 -36 -29 -184 -4 -89 -6 -165 -4 -168 2 -3 6 -107 10 -231 7 -275 11 -327 50 -564 31 -184 44 -273 60 -385 8 -63 27 -194 41 -290 39 -271 54 -408 54 -491 0 -88 -9 -101 -100 -138 -30 -12 -64 -26 -75 -30 -52 -22 -114 -41 -155 -47 -25 -4 -65 -15 -90 -24 -47 -18 -126 -19 -390 -5 -254 14 -401 93 -430 231 -21 97 0 322 38 419 22 55 78 123 118 142 l33 16 62 -57 c35 -31 85 -89 112 -129 98 -145 170 -201 257 -201 92 0 169 55 222 157 17 33 22 60 22 127 1 77 -2 91 -34 155 -40 81 -175 225 -253 270 -101 58 -282 83 -372 50 -53 -19 -66 -19 -58 1 5 14 1 16 -28 12 -126 -19 -282 -136 -389 -292 -92 -134 -127 -264 -137 -499 l-6 -158 -36 -35 c-34 -33 -152 -124 -196 -151 -106 -64 -199 -99 -223 -84 -21 13 -40 112 -47 251 -8 171 -23 289 -41 317 -20 32 -18 48 17 96 31 42 31 42 24 137 -9 139 -26 187 -85 245 -48 47 -50 48 -85 38 -29 -9 -38 -8 -59 8 -63 50 -306 114 -306 81 0 -12 -83 -52 -107 -52 -10 0 -13 6 -9 16 8 20 -7 15 -91 -32 -77 -43 -229 -191 -311 -302 -62 -85 -156 -266 -185 -357 -9 -27 -23 -86 -32 -130 -16 -79 -27 -105 -72 -177 -21 -35 -63 -68 -63 -51 0 5 9 32 19 61 11 28 15 52 11 52 -5 0 -12 -5 -16 -11 -3 -6 -17 -8 -31 -4 -32 8 -43 -2 -100 -89 -132 -203 -161 -241 -233 -310 -90 -86 -142 -116 -201 -116 -123 0 -169 114 -169 417 1 217 28 489 50 503 7 5 57 18 109 29 81 18 244 58 415 102 36 9 53 17 121 57 35 21 95 108 95 138 0 11 -7 36 -16 54 -19 36 -92 106 -108 103 -106 -23 -129 -25 -151 -13 -23 13 -91 2 -201 -31 -17 -5 -41 -9 -54 -9 -13 0 -44 -10 -68 -22 -62 -30 -78 -18 -74 53 2 30 7 70 12 89 5 19 14 67 20 105 5 39 17 108 26 155 8 47 21 121 29 165 7 44 23 123 35 175 11 52 27 129 36 170 8 41 23 111 34 155 76 328 76 333 2 414 -56 61 -78 64 -98 16 -8 -19 -21 -35 -29 -35 -10 0 -15 11 -15 35 0 25 -4 35 -15 35 -9 0 -18 -6 -21 -14 -9 -24 -55 -50 -64 -37 -22 36 -61 -29 -85 -142 -9 -39 -30 -130 -46 -202 -17 -71 -37 -157 -44 -190 -8 -33 -28 -119 -45 -190 -16 -72 -30 -144 -30 -161 0 -17 -9 -73 -20 -125 -12 -52 -27 -137 -35 -189 -8 -52 -21 -135 -29 -184 -29 -171 -28 -169 -166 -160 -78 5 -115 12 -142 27 -21 11 -38 24 -38 29 0 15 -60 38 -100 38 -22 0 -59 -9 -80 -20 -22 -11 -40 -16 -40 -11 0 5 -10 11 -21 14 -17 5 -32 -5 -65 -39 -24 -24 -48 -44 -53 -44 -14 0 -41 -66 -41 -100 0 -36 52 -113 102 -149 84 -62 277 -119 436 -128 59 -3 106 -11 112 -18 6 -7 6 -32 0 -71 -17 -104 -23 -430 -11 -554 14 -138 33 -215 71 -292 115 -232 281 -336 520 -326 100 4 137 16 238 81 92 60 264 245 345 372 35 54 60 64 65 26 9 -59 97 -173 184 -237 70 -52 268 -95 408 -89 115 5 223 64 342 189 l68 70 47 -46 c55 -53 99 -74 191 -88 143 -23 324 53 568 240 58 44 107 80 110 80 3 0 40 -31 82 -70 85 -79 164 -121 317 -171 94 -30 111 -32 280 -37 330 -8 567 37 820 157 65 31 84 36 103 28 12 -5 22 -13 22 -17 0 -5 23 -20 52 -35 63 -33 94 -29 153 20 69 56 95 110 106 223 5 53 14 122 19 152 6 30 15 96 20 145 22 182 44 320 53 333 20 26 68 42 141 48 40 4 85 4 98 1 29 -8 71 -44 88 -76 12 -24 35 -144 49 -266 16 -136 103 -294 198 -357 75 -51 122 -61 245 -55 114 5 152 15 255 63 54 26 139 111 149 150 10 37 -15 98 -57 142 -44 46 -50 48 -82 30 -24 -13 -127 -18 -127 -6 0 4 8 12 18 18 13 9 8 10 -23 5 -22 -4 -65 -9 -96 -11 -67 -7 -89 9 -89 62 0 46 -27 194 -48 264 -37 122 -151 273 -260 343 -113 72 -154 82 -333 82 -135 0 -160 -2 -176 -17 -11 -10 -29 -18 -41 -18 -12 0 -31 -9 -42 -20 -11 -11 -25 -20 -32 -20 -6 0 -19 -7 -29 -16 -32 -29 -47 -11 -53 63 -4 37 -20 140 -35 228 -47 259 -60 344 -71 445 -17 161 -33 578 -27 706 4 83 2 128 -6 144 -11 21 -112 108 -127 110 -4 0 -11 -5 -18 -12z m-2594 -1876 c30 -19 82 -89 82 -109 0 -8 -12 -30 -27 -50 -25 -33 -28 -46 -39 -197 -13 -179 -16 -193 -50 -287 -39 -105 -130 -236 -184 -264 -22 -11 -41 -11 -125 0 -54 8 -103 19 -109 25 -18 18 -10 242 13 350 47 223 175 434 326 535 42 28 66 28 113 -3z" />
        <path d="M9455 2686 c-11 -8 -26 -16 -33 -16 -41 -1 -287 -226 -352 -321 -21 -31 -53 -93 -71 -138 -18 -45 -36 -80 -40 -79 -4 2 -25 27 -47 57 -51 67 -171 192 -236 243 -90 72 -193 111 -327 124 -64 6 -72 5 -93 -15 -30 -28 -121 -36 -121 -11 0 8 11 16 25 18 14 2 29 8 35 13 15 15 -41 10 -72 -6 -15 -8 -62 -31 -103 -50 -41 -19 -99 -49 -129 -67 -49 -28 -57 -30 -85 -19 -28 10 -33 9 -53 -14 -12 -14 -31 -25 -42 -25 -66 0 -107 -60 -120 -174 -5 -45 -19 -93 -34 -125 -52 -103 -58 -132 -39 -197 9 -33 29 -78 44 -100 15 -23 35 -75 44 -115 25 -109 100 -322 134 -379 17 -28 30 -55 30 -60 0 -25 139 -147 200 -176 93 -45 223 -68 335 -60 96 6 250 47 343 91 29 14 57 25 63 25 6 0 28 -13 48 -28 55 -43 121 -80 186 -102 94 -32 393 -27 558 10 93 20 241 73 306 107 80 43 189 130 239 191 37 45 37 46 36 136 0 114 -16 147 -117 249 -79 79 -128 108 -346 202 -143 61 -237 107 -265 130 -43 33 20 160 132 269 l41 39 52 -46 c66 -58 127 -72 163 -38 12 11 29 21 37 21 24 1 56 34 83 88 27 54 27 55 -9 137 -27 59 -150 182 -192 190 -16 3 -42 10 -60 16 -62 19 -127 22 -148 5z m-1065 -518 c91 -21 237 -175 292 -309 16 -38 18 -53 9 -62 -9 -9 -13 -7 -17 11 -7 26 -12 27 -40 4 -37 -30 -45 -59 -48 -186 -2 -68 -6 -128 -10 -134 -9 -14 -166 -92 -186 -92 -9 0 -42 -8 -73 -18 -49 -17 -63 -17 -114 -6 -112 24 -135 40 -175 127 -34 74 -34 104 2 153 28 40 31 51 26 87 -8 51 -35 95 -75 125 -38 28 -41 52 -6 52 70 0 181 119 168 181 -4 23 0 29 39 47 23 11 50 22 58 25 27 10 98 7 150 -5z m796 -480 c44 -33 331 -183 397 -208 25 -9 45 -35 35 -45 -2 -3 -53 -11 -111 -19 -86 -11 -116 -19 -149 -41 -37 -25 -45 -26 -73 -16 -39 14 -92 14 -100 1 -3 -6 4 -14 16 -19 19 -7 15 -9 -26 -14 -52 -6 -82 7 -55 23 23 14 7 21 -54 21 -69 1 -78 14 -48 67 43 77 72 173 72 237 0 69 6 81 30 63 10 -7 39 -30 66 -50z" />
      </g>
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

// Centred round play button — shared by both video cards (#37). Sits dead-centre
// of the preview. Glassy (frosted) disc rather than a solid white circle so the
// portrait reads through it (Гоша #5/#6). `size` lets Дарья's card use a smaller
// button than Глеба's (#6).
function CenterPlay({ label, size = 84 }: { label: string; size?: number }) {
  // Triangle scales with the disc so its optical weight stays balanced.
  const icon = Math.round(size * 0.31);
  return (
    <button
      type="button"
      aria-label={label}
      style={{ width: size, height: size }}
      className="absolute left-1/2 top-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white shadow-[0_16px_44px_rgba(0,0,0,0.38)] ring-1 ring-white/30 backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
    >
      {/* nudge the triangle so its optical centre lands on the disc centre */}
      <span className="translate-x-[2px]">
        <PlayIcon size={icon} />
      </span>
    </button>
  );
}

function Avatar({ src, size = 54 }: { src: string; size?: number }) {
  return (
    <span className="shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image src={src} alt="" width={size} height={size} className="size-full object-cover" />
    </span>
  );
}

function Author({ r }: { r: Review }) {
  return (
    <div className="flex items-center gap-[10px]">
      <Avatar src={asset('/figma/rev-avatar.png')} />
      <div className="leading-tight">
        <div className="text-[16px] tracking-[0.03em] text-white">{r.author}</div>
        <div className="text-[14px] text-white/50">{r.role}</div>
      </div>
    </div>
  );
}

// Static waveform heights. Bar count is the seek resolution of the demo player.
const WAVE = [
  19, 14, 8, 8, 8, 8, 14, 14, 24, 17, 30, 14, 8, 17, 8, 8, 14, 14, 30, 17, 27, 30, 14, 8, 8, 14,
  14, 30, 17, 27, 30, 14, 5, 8, 8, 8, 8, 30, 24, 17, 22, 30, 24, 17, 22, 14, 8, 8, 17, 22, 30, 22,
  14, 8, 14, 8,
];

// Parse "mm:ss" → seconds, so the demo player can show a real countdown driven
// off the duration that already lives in content.ts. Falls back to 6s.
function parseDuration(d?: string): number {
  if (!d) return 6;
  const parts = d.split(':').map(Number);
  if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
    return parts[0] * 60 + parts[1];
  }
  return 6;
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

// #35 — interactive audio player. No real <audio> yet (demo state), but play/
// pause and waveform seek are fully wired so the integration is drop-in once a
// src exists: progress is a 0..1 value advanced by rAF while playing; clicking
// the waveform seeks. Played bars are accent, the rest muted grey.
function AudioCard({ r }: { r: Review }) {
  const total = useMemo(() => parseDuration(r.duration), [r.duration]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const waveRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // Advance progress in real time while playing. We drive it manually (instead
  // of an <audio> timeupdate) so the demo is interactive before audio exists.
  useEffect(() => {
    if (!playing) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // No animation loop under reduced-motion: jump to the end instead.
      setProgress(1);
      setPlaying(false);
      return;
    }

    const step = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setProgress((p) => {
        const next = p + dt / total;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, total]);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      // Restart from the top if we're at the end and the user hits play again.
      if (!p && progress >= 1) setProgress(0);
      return !p;
    });
  }, [progress]);

  // Seek: map the click x within the waveform track to 0..1.
  const seek = useCallback((clientX: number) => {
    const el = waveRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setProgress(Math.min(1, Math.max(0, ratio)));
  }, []);

  const playedBars = Math.round(progress * WAVE.length);
  const remaining = Math.max(0, total - progress * total);

  return (
    // Wide horizontal hero card across its whole row (Гоша #1): header row on
    // top (author left / logo badge right), task title beneath, full-width
    // player pinned to the bottom.
    <div
      className={`reveal-hidden relative w-full overflow-hidden rounded-card ${CARD_BORDER} ${GLASS} ${CARD_PAD}`}
    >
      <Glow className="-left-[80px] bottom-[-40px] h-[280px] w-[280px]" />
      <div className="relative flex flex-col gap-[28px]">
        <div className="flex items-start justify-between gap-[16px]">
          <Author r={r} />
          {/* glass logo badge (#2): frosted disc holding the handwritten mark */}
          <span className="grid size-[58px] shrink-0 place-items-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/15">
            <TachosMark className="w-[34px] text-inverted/70" />
          </span>
        </div>

        <p className="text-[22px] font-medium leading-[1.25] text-[#f5f7f6]">{r.text}</p>

        <div className="flex h-[80px] items-center gap-[16px] rounded-full bg-white/10 p-[10px]">
          {/* play disc — self-center keeps it on the row's vertical centre (#3) */}
          <button
            type="button"
            aria-label={playing ? 'Пауза' : 'Воспроизвести'}
            aria-pressed={playing}
            onClick={toggle}
            className="grid size-[60px] shrink-0 self-center place-items-center rounded-full bg-accent text-white transition hover:brightness-110"
          >
            {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>

          {/* Waveform doubles as a seek bar (role=slider). flex-1 + justify-between
              stretches the fixed-width bars edge-to-edge across all remaining
              width up to the timer (#4). */}
          <div
            ref={waveRef}
            role="slider"
            tabIndex={0}
            aria-label={COPY.seekLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            onClick={(e) => seek(e.clientX)}
            onKeyDown={(e) => {
              const keys = ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'];
              if (!keys.includes(e.key)) return;
              e.preventDefault();
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setProgress((p) => Math.min(1, p + 0.05));
              else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setProgress((p) => Math.max(0, p - 0.05));
              else if (e.key === 'Home') setProgress(0);
              else if (e.key === 'End') setProgress(1);
            }}
            className="flex h-full flex-1 cursor-pointer items-center justify-between rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {WAVE.map((h, i) => (
              <span
                key={i}
                style={{ height: h }}
                className={`w-[3px] shrink-0 rounded-full transition-colors ${
                  i < playedBars ? 'bg-accent' : 'bg-[#c8c8c8]/40'
                }`}
              />
            ))}
          </div>

          {/* Counts down as it plays; static "mm:ss" reads fine without JS. */}
          <span className="shrink-0 self-center px-[8px] text-[14px] tabular-nums text-white/60">
            {progress > 0 ? formatTime(remaining) : r.duration}
          </span>
        </div>
      </div>
    </div>
  );
}

function TextCard({ r }: { r: Review }) {
  const light = r.tone === 'light';
  return (
    <div
      className={`reveal-hidden relative flex h-full min-h-[300px] w-full flex-col justify-between overflow-hidden rounded-card ${CARD_PAD} backdrop-blur-md ${
        light
          ? `${CARD_BORDER} bg-gradient-to-br from-[#3a2018] via-[#241310] to-[#f05138]/35 text-white`
          : `${CARD_BORDER} bg-black/15 text-white`
      }`}
    >
      {!light && <Glow className="-left-[40px] -top-[120px] h-[300px] w-[300px]" />}
      {light && <Glow className="bottom-[10px] right-[10px] h-[240px] w-[240px] bg-accent/25" />}
      <p className="relative text-[22px] font-medium leading-[1.3]">{r.text}</p>
      <div className="relative mt-[40px]">
        <Author r={r} />
      </div>
    </div>
  );
}

// Video testimonial (Глеб) — warm orange card with a portrait still behind it
// and the centred round play button (#37).
function VideoCard({ r }: { r: Review }) {
  return (
    <div
      className={`reveal-hidden group relative h-full min-h-[440px] w-full overflow-hidden rounded-card ${CARD_PAD} text-white`}
    >
      <Image
        src={asset('/figma/founder-isaac.png')}
        alt=""
        fill
        sizes="400px"
        className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-accent/40 to-accent" />
      <CenterPlay label={COPY.videoLabel} />
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

// Portrait testimonial (Дарья) — round photo in an accent ring, with the same
// centred round play button over the portrait (#37).
function PortraitCard({ r }: { r: Review }) {
  return (
    <div
      className={`reveal-hidden group relative flex h-full min-h-[440px] w-full flex-col items-center justify-center gap-[24px] overflow-hidden rounded-card ${CARD_BORDER} bg-white/[0.06] ${CARD_PAD} text-center backdrop-blur-md`}
    >
      <Glow className="left-1/2 top-[40px] h-[260px] w-[260px] -translate-x-1/2 bg-accent/20" />
      <div className="relative size-[210px] overflow-hidden rounded-full ring-2 ring-accent/70">
        <Image
          src={asset('/figma/founder-jennifer.png')}
          alt=""
          fill
          sizes="210px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {/* play sits centred over the portrait — glassy + smaller than Глеба's (#6) */}
        <CenterPlay label={COPY.videoLabel} size={64} />
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

// ─── Starfield (#34) ───────────────────────────────────────────────────
// Denser, varied "космос": a deterministic set of stars (fixed seed so SSR and
// the client first paint match — no hydration mismatch). Each star gets its own
// size, base opacity and twinkle timing. Reduced-motion → no animation, stars
// stay static (handled in the inline <style> media query).
type Star = { x: number; y: number; r: number; o: number; delay: number; dur: number };

function makeStars(count: number): Star[] {
  // Tiny deterministic PRNG (mulberry32) keeps positions stable across renders.
  let seed = 0x9e3779b9;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const big = rand() > 0.82; // ~18% are larger, brighter "hero" stars
    // Push stars out to the side gutters and away from the central ~36..64%
    // band where the card column lives, so no lonely dim dot sits right next to
    // a card edge (Гоша #7). We bias x toward the screen edges and skip the
    // middle: pick a side, then place within that side's outer half.
    const leftSide = rand() < 0.5;
    const x = leftSide ? rand() * 34 : 66 + rand() * 34; // 0..34 or 66..100
    return {
      x,
      y: rand() * 100,
      r: big ? 1.4 + rand() * 1.1 : 0.5 + rand() * 0.8,
      o: big ? 0.55 + rand() * 0.4 : 0.2 + rand() * 0.4,
      delay: rand() * 6,
      dur: 2.6 + rand() * 4.5,
    };
  });
}

function Starfield() {
  // Generated once. Confined to the side gutters (see makeStars) so the card
  // column stays clean; ~70 keeps the "космос" feel without lonely dots (#7).
  const stars = useMemo(() => makeStars(70), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="rev-star absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.r * 2}px`,
            height: `${s.r * 2}px`,
            opacity: s.o,
            // brighter stars get a soft halo so sizes read distinct
            boxShadow: s.r > 1.3 ? `0 0 ${s.r * 4}px rgba(255,255,255,0.6)` : undefined,
            // --rev-o feeds the twinkle keyframe so each star dims to half ITS
            // own brightness, not a shared value
            '--rev-o': s.o,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  const ref = useReveal<HTMLDivElement>({ stagger: 90, threshold: 0.05 });
  const [audio, t1, v1, t2, v2] = reviews.items;

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#05010d] pb-[160px] pt-[120px] text-white">
      {/* #34 — soft twinkle for the starfield; static under reduced-motion */}
      <style>{`
        @keyframes rev-twinkle {
          0%, 100% { opacity: calc(var(--rev-o) * 0.5); }
          50%      { opacity: var(--rev-o); }
        }
        .rev-star { animation: rev-twinkle linear infinite; will-change: opacity; }
        @media (prefers-reduced-motion: reduce) {
          .rev-star { animation: none !important; opacity: var(--rev-o); }
        }
      `}</style>

      {/* starfield + soft accent bloom — Vadim: the bg felt empty, wanted "космос" */}
      <Starfield />
      <div className="pointer-events-none absolute left-1/2 top-[6%] h-[540px] w-[840px] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[170px]" aria-hidden />
      <div className="pointer-events-none absolute -right-[140px] bottom-[14%] h-[420px] w-[420px] rounded-full bg-accent/[0.10] blur-[150px]" aria-hidden />

      <div className="relative mx-auto max-w-[861px] px-6 text-center">
        <h2 className="text-[52px] font-semibold leading-[0.9] tracking-[-0.02em]">{reviews.title}</h2>
        <p className="mx-auto mt-[28px] max-w-[320px] text-[19px] leading-[1.4] text-white/75">
          {reviews.subtitle}
        </p>
      </div>

      <div ref={ref} className="relative mx-auto mt-[56px] flex max-w-[900px] flex-col gap-[28px] px-6">
        <AudioCard r={audio} />
        {/* balanced 2×2 mosaic: text + Глеб video on top, Дарья portrait + text below */}
        <div className="grid grid-cols-1 items-stretch gap-[28px] md:grid-cols-2">
          <TextCard r={t1} />
          <VideoCard r={v1} />
          <PortraitCard r={v2} />
          <TextCard r={t2} />
        </div>
      </div>
    </section>
  );
}
