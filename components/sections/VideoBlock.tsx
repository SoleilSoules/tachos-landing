import { asset } from '@/lib/asset';

// Office/team video on a white surface (no heading — just the clip). The Kinescope
// embed was ripped out for good: even in background mode its player kept surfacing a
// dark overlay/letterbox bar that read as a "shadow". A native <video> has NO player
// chrome at all — autoplay + muted + loop + object-cover fills the 16:9 frame edge to
// edge, so a shadow is physically impossible. TEMPORARY stand-in clip; swap the src
// for Vadim's own studio footage when it lands.
export function VideoBlock() {
  return (
    <section id="studio" className="bg-white py-12 lg:py-[120px]">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink lg:rounded-card">
          <video
            src={asset('/figma/hero-belt-v15.mp4')}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
