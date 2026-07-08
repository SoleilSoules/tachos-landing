// Orange "planetary sunrise": a hot glow rising from behind a dark curved horizon,
// in the brand palette (warm-white core → accent → redline). Pure CSS, static,
// cheap. Layers, bottom → top: upward bloom, hot core, dark planet disc that
// occludes the lower half (making the horizon line), a bright atmosphere rim.
export function HeroSunrise() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft upward bloom above the horizon */}
      <div
        className="absolute left-1/2 top-[58%] h-[640px] w-[1200px] -translate-x-1/2 -translate-y-full"
        style={{
          background:
            'radial-gradient(50% 72% at 50% 100%, rgba(255,138,76,0.55), rgba(240,81,31,0.20) 44%, transparent 74%)',
          filter: 'blur(44px)',
        }}
      />
      {/* hot rising core just behind the horizon */}
      <div
        className="absolute left-1/2 top-[58%] h-[380px] w-[560px] -translate-x-1/2 -translate-y-[84%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 62%, #ffe9db 0%, #ff8a4c 24%, #f0511f 50%, transparent 72%)',
          filter: 'blur(8px)',
        }}
      />
      {/* dark planet body — its top edge is the horizon; occludes the lower glow */}
      <div
        className="absolute left-1/2 top-[58%] h-[3200px] w-[4800px] -translate-x-1/2 rounded-[50%]"
        style={{ background: '#050506' }}
      />
      {/* bright atmosphere rim riding the horizon edge */}
      <div
        className="absolute left-1/2 top-[58%] h-[3200px] w-[4800px] -translate-x-1/2 rounded-[50%]"
        style={{
          boxShadow:
            'inset 0 3px 20px -2px rgba(255,150,92,0.85), 0 -1px 44px 3px rgba(255,110,60,0.35)',
        }}
      />
    </div>
  );
}
