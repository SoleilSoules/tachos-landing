'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { asset } from '@/lib/asset';
import { nav } from '@/lib/content';

function LogoImg() {
  return (
    <Image
      src={asset('/logos/tachos.svg')}
      alt="tachos"
      width={90}
      height={22}
      priority
      className="block"
      style={{ height: 22, width: 'auto' }}
    />
  );
}

// On the home page nav items are in-page hash anchors (Lenis smooth-scrolls them).
// On sub-pages (case / blog) they must route back to the home section, so prefix
// with "/" and use next/link (which also applies the prod basePath automatically).
function NavLink({
  href,
  onHome,
  className,
  onClick,
  children,
}: {
  href: string;
  onHome: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return onHome ? (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link href={`/${href}`} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === '/';

  // Vadim: once you scroll, the bar should pin with a plate. Transparent over the
  // dark hero, then a dark blurred plate so the white nav text stays readable
  // over the light sections below.
  const [stuck, setStuck] = useState(false);
  // On <lg the links don't fit — collapse them into a burger menu.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // While the burger menu is open, lock page scroll (stop Lenis if present, else
  // body.overflow on touch) so the page behind the overlay doesn't scroll.
  useEffect(() => {
    if (!menuOpen) return;
    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-300 lg:px-[14px] ${
        stuck ? 'pt-[10px]' : 'pt-0'
      }`}
    >
      {/* The bar keeps a CONSTANT horizontal padding in both states so the logo
          and CTA never shift sideways when you scroll — only the plate (bg /
          border / shadow / blur) and the height appear/change on `stuck`. */}
      <div
        className={`mx-auto flex w-full max-w-page items-center justify-between rounded-[22px] px-[14px] transition-all duration-300 lg:px-[34px] ${
          stuck
            ? 'h-[60px] border border-white/10 bg-ink/75 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            : 'h-[64px] border border-transparent lg:h-[84px]'
        }`}
      >
        {/* logo alone on the left; home scrolls to top, sub-pages route home */}
        {onHome ? (
          <a href="#" data-logo-mark className="flex items-center" aria-label="tachos — на главную">
            <LogoImg />
          </a>
        ) : (
          <Link href="/" data-logo-mark className="flex items-center" aria-label="tachos — на главную">
            <LogoImg />
          </Link>
        )}

        {/* desktop: links + CTA inline */}
        <div className="hidden items-center gap-[40px] lg:flex">
          <nav className="nums flex items-center gap-[34px]">
            {nav.links.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                onHome={onHome}
                className="text-[16px] font-medium tracking-[0.04em] text-inverted transition-colors hover:text-accent-bright"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <a
            href="#contacts"
            data-compose
            className="rounded-button bg-accent-bright px-[16px] py-[7px] text-[16px] text-inverted backdrop-blur-sm transition hover:brightness-110"
          >
            {nav.cta}
          </a>
        </div>

        {/* mobile: burger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          className="grid size-[40px] place-items-center text-inverted lg:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* mobile menu overlay — slides down from the top */}
      {menuOpen && (
      <div className="fixed inset-0 z-[60] lg:hidden">
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm [animation:fade-in_0.2s_ease-out]"
        />
        <nav className="absolute inset-x-0 top-0 flex flex-col gap-[2px] rounded-b-[28px] bg-ink px-6 pb-[28px] pt-[76px] shadow-[0_30px_80px_rgba(0,0,0,0.5)] [animation:fade-up_0.25s_ease-out]">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Закрыть меню"
            className="absolute right-[16px] top-[16px] grid size-[40px] place-items-center text-inverted"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {nav.links.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              onHome={onHome}
              onClick={() => setMenuOpen(false)}
              className="py-[12px] text-[22px] font-medium text-inverted transition-colors hover:text-accent-bright"
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="#contacts"
            data-compose
            onClick={() => setMenuOpen(false)}
            className="mt-[14px] rounded-button bg-accent-bright px-[20px] py-[13px] text-center text-[17px] text-inverted"
          >
            {nav.cta}
          </a>
        </nav>
      </div>
      )}
    </header>
  );
}
