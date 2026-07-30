'use client';

import { useUrlParam } from '@/lib/useUrlParam';
import { HeroSunriseShader } from './HeroSunriseShader';
import { HeroBeyond } from './HeroBeyond';
import { HeroPhone } from './HeroPhone';

// Hero background switch, read client-side so it survives static export. Default
// is our own hero reel (full-bleed); two alternatives remain for comparison:
//   default / ?bg=reel  → the hero reel we shot
//   ?bg=shader          → our WebGL sunrise shader
//   ?bg=phone           → the original static iPhone mockup
export function HeroBg() {
  const q = useUrlParam('bg');
  if (q === 'shader') return <HeroSunriseShader />;
  if (q === 'phone') return <HeroPhone />;
  return <HeroBeyond />;
}
