import { asset } from '@/lib/asset';
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
import { VideoBlock } from '@/components/sections/VideoBlock';

export default function Home() {
  return (
    /* Full-bleed dark canvas; nav + logo wall stretch to the screen edges,
       while text/founder blocks keep their fixed widths and self-centre. */
    <main className="w-full bg-bg">
      <section className="relative min-h-[88vh] overflow-hidden bg-bg text-inverted">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1340px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-ink" />
          {/* warm brand glow behind the device, as in the concept */}
          <div className="absolute left-1/2 top-[110px] h-[760px] w-[1040px] -translate-x-1/2 rounded-full bg-accent/30 blur-[150px]" />
          {/* Our own hero render (Remotion CSS-3D): a device showing a real studio
              project, slow cinematic camera flythrough on a dark studio backdrop.
              poster falls back to the previous warm mockup for reduced-motion. */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={asset('/figma/hero-bg.png')}
            className="absolute left-1/2 top-0 h-[1340px] w-full max-w-[1600px] -translate-x-1/2 object-cover object-[center_42%] opacity-95 motion-reduce:hidden"
          >
            <source src={asset('/figma/hero-remotion.mp4')} type="video/mp4" />
          </video>
          {/* vertical wash: keeps the device muted so the H1 and orange
              sub-head stay readable over its centre */}
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
      <VideoBlock />
      <Products />
      <Blog />
      <Footer />
    </main>
  );
}
