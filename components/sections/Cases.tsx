import { cases } from '@/lib/content';
import { CaseTabs } from './CaseTabs';
import { CasesHeadingClient } from './CasesHeadingClient';
import { CaseGridClient } from './CaseGridClient';

export function Cases() {
  return (
    <section id="cases" className="bg-white pb-[160px] pt-[120px]">
      <CasesHeadingClient />

      <div className="mx-auto mt-[44px] max-w-page px-[80px]">
        <CaseTabs />
        <CaseGridClient cases={cases} />
        {/* anchor: the floating panel expands to "Все кейсы" only past this point */}
        <div id="cases-end" aria-hidden className="h-px w-full" />
      </div>
    </section>
  );
}
