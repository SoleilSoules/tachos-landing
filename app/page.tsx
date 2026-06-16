import Image from 'next/image';
import { asset } from '@/lib/asset';
import { ComposeProvider } from '@/components/compose/ComposeProvider';
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

export default function Home() {
  return (
    <ComposeProvider>
    {/* Full-bleed dark canvas; nav + logo wall stretch to the screen edges,
        while text/founder blocks keep their fixed widths and self-centre. */}
    <main className="w-full overflow-x-hidden bg-bg">
      <section className="relative overflow-hidden bg-bg text-inverted">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1340px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-ink" />
          {/* warm glow behind the device, as in the concept */}
          <div className="absolute left-1/2 top-[110px] h-[760px] w-[1040px] -translate-x-1/2 rounded-full bg-accent/40 blur-[150px]" />
          {/* iPhone mockup — large close-up like the concept; cropped to its
              centre so the stock white backdrop falls outside the frame */}
          <div className="absolute left-1/2 top-0 h-[1340px] w-[1120px] -translate-x-1/2 overflow-hidden [animation:float-y_7s_ease-in-out_infinite] motion-reduce:[animation:none]">
            <Image
              src={asset('/figma/hero-bg.png')}
              alt=""
              fill
              priority
              sizes="1120px"
              className="scale-[1.1] object-cover object-[center_16%] brightness-[0.6] saturate-[0.82] sepia-[0.22]"
            />
          </div>
          {/* vertical wash: the concept keeps the device warm + muted (not a bright
              stock screen) so the H1 and orange sub-head stay readable over its centre */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/38 to-bg" />
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
      <Products />
      <Blog />
      <Footer />
    </main>
    </ComposeProvider>
  );
}
