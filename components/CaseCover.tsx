import Image from 'next/image';
import { asset } from '@/lib/asset';

// Brand cover for a case. One unified light-grey Apple-style field for ALL cases
// (no per-brand colours). When the case has a real product screenshot (`shot`), it
// sits in a premium straight device mockup (browser for `desktop`, iPhone for
// `phone`) that drops slightly off the bottom edge. Otherwise a generated cover
// with a huge translucent initial.

// Single shared light field (apple.com product-grey).
const FIELD = 'from-[#f6f6f8] via-[#ededf0] to-[#e4e4e8]';

// Clean Apple-style browser window — light chrome, soft deep shadow, straight.
function BrowserMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[12px] bg-white ring-1 ring-black/10 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.4)] ${
        big ? 'w-[80%]' : 'w-[88%]'
      }`}
    >
      <div className="flex h-[26px] items-center gap-[6px] bg-[#ececee] px-[12px]">
        <span className="size-[8px] rounded-full bg-[#ff5f57]" />
        <span className="size-[8px] rounded-full bg-[#febc2e]" />
        <span className="size-[8px] rounded-full bg-[#28c840]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={asset(shot)} alt={client} fill sizes="(max-width: 1024px) 100vw, 720px" className="object-cover object-top" />
      </div>
    </div>
  );
}

// Clean iPhone — dark frame, Dynamic Island, soft deep shadow, straight.
function PhoneMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div
      className={`relative aspect-[9/19.3] rounded-[15%] bg-[#0b0b0d] p-[2.2%] ring-1 ring-black/10 shadow-[0_40px_80px_-26px_rgba(0,0,0,0.45)] ${
        big ? 'h-[112%]' : 'h-[104%]'
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[13%] bg-black">
        <Image src={asset(shot)} alt={client} fill sizes="360px" className="object-cover object-top" />
        <div className="absolute left-1/2 top-[1.8%] h-[2.4%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

export function CaseCover({
  id: _id,
  client,
  shot,
  shotKind = 'desktop',
  variant = 'card',
  className = '',
}: {
  id: string;
  client: string;
  shot?: string;
  shotKind?: 'phone' | 'desktop';
  variant?: 'card' | 'hero';
  className?: string;
}) {
  const initial = client.trim().charAt(0).toUpperCase();
  const initialSize = variant === 'hero' ? 'clamp(180px,34vw,360px)' : '230px';
  const big = variant === 'hero';

  return (
    <div className={`relative flex h-full w-full items-end justify-center overflow-hidden bg-gradient-to-br ${FIELD} ${className}`}>
      {shot ? (
        // mockup pushed slightly below the bottom edge (clipped) for depth
        <div className="flex w-full translate-y-[12%] justify-center">
          {shotKind === 'phone' ? (
            <PhoneMock shot={shot} client={client} big={big} />
          ) : (
            <BrowserMock shot={shot} client={client} big={big} />
          )}
        </div>
      ) : (
        <span
          aria-hidden
          className="absolute -bottom-[0.2em] right-[0.04em] select-none font-semibold leading-none text-black/[0.06]"
          style={{ fontSize: initialSize }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
