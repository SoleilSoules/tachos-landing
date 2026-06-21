// Generated brand cover for a case — no real stills yet, so each case gets its
// own distinct, code-drawn artwork (brand gradient + glowing orbs + fine grid +
// a huge translucent initial) instead of one shared placeholder photo. Replace
// with real screenshots from Vadim later by swapping this for an <Image>.

type Cover = { grad: string; orb: string };

const COVERS: Record<string, Cover> = {
  skladno: { grad: 'from-[#27405a] via-[#16273a] to-[#0b1620]', orb: 'rgba(86,148,210,0.45)' },
  hais: { grad: 'from-[#0e5240] via-[#073227] to-[#031a14]', orb: 'rgba(40,196,142,0.42)' },
  maginary: { grad: 'from-[#3d2060] via-[#241241] to-[#130a26]', orb: 'rgba(154,96,232,0.44)' },
  dobry: { grad: 'from-[#7c3314] via-[#4a1d0b] to-[#250e05]', orb: 'rgba(240,124,52,0.46)' },
  potok: { grad: 'from-[#0d4b4f] via-[#072d30] to-[#03191b]', orb: 'rgba(42,204,204,0.4)' },
  grace: { grad: 'from-[#5a2740] via-[#3a1628] to-[#1f0b16]', orb: 'rgba(232,96,150,0.42)' },
};

const GRID =
  'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)';

export function CaseCover({
  id,
  client,
  variant = 'card',
  className = '',
}: {
  id: string;
  client: string;
  variant?: 'card' | 'hero';
  className?: string;
}) {
  const c = COVERS[id] ?? COVERS.skladno;
  const initial = client.trim().charAt(0).toUpperCase();
  const initialSize = variant === 'hero' ? 'clamp(180px,34vw,360px)' : '230px';

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${c.grad} ${className}`}>
      {/* glowing brand orbs */}
      <div
        aria-hidden
        className="absolute -left-[12%] -top-[14%] h-[60%] w-[60%] rounded-full blur-[60px]"
        style={{ background: c.orb }}
      />
      <div
        aria-hidden
        className="absolute -bottom-[18%] -right-[10%] h-[64%] w-[64%] rounded-full blur-[72px] opacity-70"
        style={{ background: c.orb }}
      />
      {/* fine technical grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: GRID, backgroundSize: '34px 34px' }}
      />
      {/* huge translucent initial, bottom-right */}
      <span
        aria-hidden
        className="absolute -bottom-[0.2em] right-[0.04em] select-none font-semibold leading-none text-white/[0.08]"
        style={{ fontSize: initialSize }}
      >
        {initial}
      </span>
    </div>
  );
}
