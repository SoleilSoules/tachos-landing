import Image from 'next/image';
import { nav } from '@/lib/content';

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="relative flex h-[84px] w-full items-center px-[48px]">
        <a href="#" className="absolute left-[48px]" aria-label="tachos — на главную">
          <Image
            src="/logos/tachos.svg"
            alt="tachos"
            width={118}
            height={28}
            priority
            style={{ height: 28, width: 'auto' }}
          />
        </a>

        <nav className="nums mx-auto flex items-center gap-[40px]">
          {nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[16px] tracking-[0.04em] text-inverted/90 transition-colors hover:text-inverted"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contacts"
          data-compose
          className="absolute right-[48px] rounded-button bg-accent-bright px-[16px] py-[9px] text-[16px] text-inverted backdrop-blur-sm transition hover:brightness-110"
        >
          {nav.cta}
        </a>
      </div>
    </header>
  );
}
