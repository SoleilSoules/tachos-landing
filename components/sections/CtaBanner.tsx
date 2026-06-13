import { ctaBanner } from '@/lib/content';

// Dark CTA strip sitting on the dark zone right after the reviews.
export function CtaBanner() {
  return (
    <section className="bg-bg pb-[120px] text-inverted">
      <div className="mx-auto max-w-page px-[80px]">
        <div className="flex flex-col gap-[28px] rounded-[28px] border border-white/8 bg-white/[0.04] p-[44px] md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="max-w-[560px] text-[30px] font-semibold leading-[1.15] tracking-[-0.01em]">
              {ctaBanner.title}
            </h2>
            <p className="mt-[12px] text-[14px] uppercase tracking-[0.04em] text-inverted/40">
              {ctaBanner.note}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-[14px]">
            <span className="grid size-[44px] shrink-0 place-items-center rounded-full bg-white/10 text-[16px] font-semibold text-inverted">
              А
            </span>
            <button
              type="button"
              data-compose
              className="flex w-fit items-center rounded-pill bg-accent px-[28px] py-[16px] text-[16px] font-medium text-white transition hover:brightness-105"
            >
              {ctaBanner.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
