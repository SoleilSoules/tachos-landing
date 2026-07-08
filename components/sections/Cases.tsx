import { cases } from '@/lib/content';
import { CasesHeadingClient } from './CasesHeadingClient';
import { CasesExplorer } from './CasesExplorer';
import { CasesTopEdge } from './CasesTopEdge';

export function Cases() {
  return (
    <section id="cases" className="relative bg-white pb-[160px] pt-[72px]">
      {/* curved top edge for the smoke variant, flat for the beam variant */}
      <CasesTopEdge />

      <CasesHeadingClient />

      <div className="mx-auto mt-[44px] max-w-page px-5 sm:px-8 lg:px-[80px]">
        <CasesExplorer cases={cases.filter((c) => !c.hidden)} />
        {/* anchor: the floating panel expands to "Все кейсы" only past this point */}
        <div id="cases-end" aria-hidden className="h-px w-full" />
      </div>
    </section>
  );
}
