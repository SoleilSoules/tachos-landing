import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { Founder } from '@/components/sections/Founder';
import { Cases } from '@/components/sections/Cases';
import { Reviews } from '@/components/sections/Reviews';
import { Products } from '@/components/sections/Products';
import { Blog } from '@/components/sections/Blog';
import { Footer } from '@/components/sections/Footer';
import { Services } from '@/components/sections/Services';
import { VideoBlock } from '@/components/sections/VideoBlock';
import { HeroBg } from '@/components/sections/HeroBg';
import { HeroGlow } from '@/components/sections/HeroGlow';

export default function Home() {
  return (
    /* Full-bleed dark canvas; nav + logo wall stretch to the screen edges,
       while text/founder blocks keep their fixed widths and self-centre. */
    <main className="w-full bg-bg">
      {/* The reel owns the first screen and the copy is pinned to its bottom edge
          (filter.im composition); the flex-1 spacer is what pushes the text down.
          Height is capped by the reel's own 16:9 frame so no black band shows under
          it, and it stays below the viewport so a sliver of Cases peeks out. */}
      <section className="relative flex min-h-[86vh] flex-col overflow-hidden bg-bg text-inverted lg:min-h-[min(88vh,56.25vw)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-ink" />
          {/* soft blurred brand glow behind the text — phone variant only */}
          <HeroGlow />
          {/* The hero reel, full-bleed. ?bg= swaps in the older backgrounds. */}
          <HeroBg />
          {/* Flat 20% black over the footage — no gradient, per Гоша */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <Nav />
        <div className="flex-1" />
        <Hero />
        <Founder />
      </section>

      <Cases />
      <Reviews />
      {/* CTA copy lives in the morphing FloatingCompose now; this is just the
          scroll zone where it expands into the "Обсудить проект" state. */}
      <div id="cta-zone" aria-hidden className="h-[220px] bg-bg" />
      <Services />
      {/* «Студия изнутри» — back on, now playing our own studio footage */}
      <VideoBlock />
      <Products />
      <Blog />
      <Footer />
    </main>
  );
}
