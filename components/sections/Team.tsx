'use client';

import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';
import { WordsReveal } from '@/components/WordsReveal';
import { teamIntro, teamRoles } from '@/lib/content';

// The role cards used to stand in for the services offer. The copy doc keeps
// them — including the mascot's per-role lines — but asks for them to live away
// from the services block, so they get their own section further down the page.
export function Team() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="team"
      className="bg-white pb-[56px] pt-[48px] sm:pb-[64px] sm:pt-[64px] lg:pb-[96px] lg:pt-[96px]"
    >
      <div ref={ref} className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        <WordsReveal
          as="h2"
          stagger={48}
          className="max-w-[680px] text-[clamp(28px,7.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-fg lg:leading-[1.08]"
        >
          {teamIntro.title}
        </WordsReveal>
        <WordsReveal
          as="p"
          stagger={20}
          start={260}
          className="mt-[16px] block max-w-[520px] text-[16px] leading-[1.45] text-black/50 sm:mt-[20px] sm:text-[19px] sm:leading-[1.4]"
        >
          {teamIntro.body}
        </WordsReveal>
        {/* the only entry point to the «О компании» page */}
        <Link
          href="/about"
          className="mt-[14px] inline-flex items-center gap-[8px] text-[16px] font-medium text-accent transition hover:brightness-110"
        >
          О компании
          <span aria-hidden>↗</span>
        </Link>

        <div className="mt-[32px] grid grid-cols-2 gap-[10px] sm:mt-[44px] sm:grid-cols-3 sm:gap-[14px] lg:grid-cols-4">
          {teamRoles.map((role, i) => (
            <div
              key={role}
              data-hint="role"
              data-hint-sub={role}
              className="reveal-hidden group relative flex min-h-[96px] flex-col justify-between rounded-[14px] bg-[#f3f4f6] px-[14px] py-[14px] transition duration-200 hover:bg-[#eceef0] sm:min-h-[112px] sm:rounded-[20px] sm:px-[22px] sm:py-[18px]"
            >
              <span className="text-[13px] font-medium tabular-nums text-black/30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-end justify-between gap-[6px] sm:gap-[10px]">
                <span className="text-[15px] font-medium leading-[1.25] tracking-[-0.01em] text-fg sm:text-[18px] sm:leading-[1.2]">
                  {role}
                </span>
                <span
                  aria-hidden
                  className="-translate-x-1 text-[16px] leading-none text-accent opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
