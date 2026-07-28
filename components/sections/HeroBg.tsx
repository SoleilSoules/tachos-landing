'use client';

import { useUrlParam } from '@/lib/useUrlParam';
import { HeroSunriseShader } from './HeroSunriseShader';
import { HeroBeyond } from './HeroBeyond';
import { HeroPhone } from './HeroPhone';

// Hero background switch, read client-side so it survives static export. Default
// is our own hero reel (full-bleed); the rest are kept for comparison:
//   default / ?bg=reel  → the hero reel we shot
//   ?bg=smoke           → orange sunrise-smoke video
//   ?bg=beam            → orange laser-beam video
//   ?bg=shader          → our WebGL shader
//   ?bg=phone           → the original static iPhone mockup
type Bg = 'reel' | 'beam' | 'smoke' | 'shader' | 'phone' | 'v1' | 'v2' | 'v3';
const VALID: Bg[] = ['reel', 'smoke', 'beam', 'shader', 'phone', 'v1', 'v2', 'v3'];

export function HeroBg() {
  const q = useUrlParam('bg');
  const bg: Bg = q && VALID.includes(q as Bg) ? (q as Bg) : 'reel';

  if (bg === 'shader') return <HeroSunriseShader />;
  if (bg === 'phone') return <HeroPhone />;
  // key forces a fresh <video> when the variant changes — otherwise the browser
  // keeps playing the first-mounted source and ignores the swapped <source src>.
  return <HeroBeyond key={bg} variant={bg} />;
}
