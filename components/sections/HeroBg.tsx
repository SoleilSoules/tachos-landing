'use client';

import { useEffect, useState } from 'react';
import { HeroSunriseShader } from './HeroSunriseShader';
import { HeroBeyond } from './HeroBeyond';
import { HeroPhone } from './HeroPhone';

// Hero background switch, read client-side so it survives static export. Default
// is the orange sunrise-smoke video; the rest are kept for comparison:
//   default / ?bg=smoke → orange sunrise-smoke video
//   ?bg=beam            → orange laser-beam video
//   ?bg=shader          → our WebGL shader
//   ?bg=phone           → the original static iPhone mockup
type Bg = 'beam' | 'smoke' | 'shader' | 'phone' | 'v1' | 'v2' | 'v3';
const VALID: Bg[] = ['smoke', 'beam', 'shader', 'phone', 'v1', 'v2', 'v3'];

export function HeroBg() {
  const [bg, setBg] = useState<Bg>('smoke');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('bg') as Bg | null;
    if (q && VALID.includes(q)) setBg(q);
  }, []);

  if (bg === 'shader') return <HeroSunriseShader />;
  if (bg === 'phone') return <HeroPhone />;
  // key forces a fresh <video> when the variant changes — otherwise the browser
  // keeps playing the first-mounted source and ignores the swapped <source src>.
  return <HeroBeyond key={bg} variant={bg} />;
}
