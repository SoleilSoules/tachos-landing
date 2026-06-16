'use client';

import { useReveal } from '@/hooks/useReveal';
import { lettersIntro, letters, type Letter } from '@/lib/content';

// Card matches the Figma "благодарственные" block: centred tag + title + text
// over a grey image placeholder (real scans/photos come from Vadim).
function LetterCard({ tag, title, text }: Letter) {
  return (
    <article className="reveal-hidden flex flex-col items-center rounded-[28px] bg-surface p-[28px] text-center">
      <span className="rounded-full bg-white px-[20px] py-[8px] text-[13px] font-medium text-fg shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {tag}
      </span>
      <h3 className="mt-[22px] text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-fg">
        {title}
      </h3>
      <p className="mt-[12px] max-w-[300px] text-[14px] leading-[1.4] text-black/50">{text}</p>
      <div className="mt-[24px] h-[200px] w-full rounded-[20px] bg-black/[0.12]" />
    </article>
  );
}

export function Letters() {
  const ref = useReveal<HTMLDivElement>({ stagger: 80, threshold: 0.1 });

  return (
    <section id="letters" className="bg-white pt-[120px] pb-[40px]">
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <h2 className="text-[52px] font-semibold leading-[1.0] tracking-[-0.02em] text-fg">
          {lettersIntro.title}
        </h2>
        <p className="mx-auto mt-[20px] max-w-[480px] text-[19px] leading-[1.4] text-black/45">
          {lettersIntro.body}
        </p>
      </div>

      <div
        ref={ref}
        className="mx-auto mt-[56px] grid max-w-page grid-cols-1 gap-[24px] px-[80px] md:grid-cols-3"
      >
        {letters.map((l) => (
          <LetterCard key={l.id} {...l} />
        ))}
      </div>
    </section>
  );
}
