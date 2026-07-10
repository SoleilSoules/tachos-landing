import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { LogoWall } from '@/components/sections/LogoWall';
import { Founder } from '@/components/sections/Founder';
import { Cases } from '@/components/sections/Cases';
import { Reviews } from '@/components/sections/Reviews';
import { Products } from '@/components/sections/Products';
import { Blog } from '@/components/sections/Blog';
import { Footer } from '@/components/sections/Footer';
import { Services } from '@/components/sections/Services';
import { HeroBg } from '@/components/sections/HeroBg';
import { HeroGlow } from '@/components/sections/HeroGlow';

export default function Home() {
  return (
    /* Full-bleed dark canvas; nav + logo wall stretch to the screen edges,
       while text/founder blocks keep their fixed widths and self-centre. */
    <main className="w-full bg-bg">
      <section className="relative min-h-[86vh] overflow-hidden bg-bg text-inverted">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1340px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-ink" />
          {/* soft blurred brand glow behind the text — phone variant only */}
          <HeroGlow />
          {/* Animated orange "beyond horizons" sunrise — our WebGL shader by
              default, or the HQ recoloured video via ?bg=video (client swap). */}
          <HeroBg />
          {/* vertical wash: lighter now so the ascii effect stays visible, still
              enough at top/bottom to keep the H1 and orange sub-head readable */}
          <div className="via-bg/10 absolute inset-0 bg-gradient-to-b from-bg/35 to-bg" />
        </div>

        <Nav />
        <Hero />
        <LogoWall />
        <Founder />
      </section>

      <Cases />
      <Reviews />
      {/* CTA copy lives in the morphing FloatingCompose now; this is just the
          scroll zone where it expands into the "Обсудить проект" state. */}
      <div id="cta-zone" aria-hidden className="h-[220px] bg-bg" />
      <Services />
      {/* VideoBlock («Студия изнутри») temporarily hidden per Gosha */}
      <Products />
      <Blog />
      <Footer />
    </main>
  );
}
