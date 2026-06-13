'use client';

import Image from 'next/image';
import { useState } from 'react';
import { asset } from '@/lib/asset';
import { footer, type Social } from '@/lib/content';
import { validateContact } from '@/lib/compose';

const SOC_ICON: Record<Social['kind'], string | null> = {
  tg: '/figma/soc-tg.svg',
  vk: '/figma/soc-vk.svg',
  yt: null, // no glyph in the concept — muted disc placeholder
  link: '/figma/soc-link.svg',
};

function SocialCard({ s }: { s: Social }) {
  const icon = SOC_ICON[s.kind];
  return (
    <a
      href="#"
      className="flex items-center gap-[10px] rounded-full py-[5px] pl-[5px] pr-[16px] transition hover:bg-white/[0.05]"
    >
      {icon ? (
        <Image src={asset(icon)} alt="" width={48} height={48} className="size-[48px] shrink-0" />
      ) : (
        <span className="size-[48px] shrink-0 rounded-full bg-[#d3d3d3]/20" />
      )}
      <span className="leading-tight">
        <span className="block text-[13px] font-medium tracking-[0.04em] text-white">{s.brand}</span>
        <span className="block text-[13px] tracking-[0.04em] text-white/55">{s.label}</span>
      </span>
    </a>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const base =
    'w-full rounded-[16px] bg-[#201f1f] px-[24px] text-[16px] font-semibold text-white outline-none transition placeholder:font-semibold placeholder:text-white/40 focus:ring-1 focus:ring-white/20';
  return textarea ? (
    <textarea
      rows={5}
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${base} h-[200px] resize-none py-[19px] leading-[1.4]`}
    />
  ) : (
    <input
      type="text"
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${base} h-[60px]`}
    />
  );
}

export function Footer() {
  const [form, setForm] = useState({ name: '', company: '', contact: '', brief: '' });
  const [budget, setBudget] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (validateContact(form.contact)) {
      setError('Оставьте корректный контакт — почту, телефон или @telegram');
      setStatus('error');
      return;
    }
    if (!consent) {
      setError('Нужно согласие на обработку данных');
      setStatus('error');
      return;
    }
    setError('');
    setStatus('sending');
    window.setTimeout(() => setStatus('success'), 900);
  };

  const sent = status === 'success';

  return (
    <footer id="contacts" className="relative overflow-hidden rounded-t-[40px] bg-bg text-inverted">
      <div className="relative mx-auto max-w-page px-[96px] pb-[54px] pt-[100px]">
        {/* brand fire — the tachos flame, oversized on the right */}
        <div className="pointer-events-none absolute right-[10px] top-[40px] h-[700px] w-[560px]">
          <Image src={asset('/figma/footer-fire.svg')} alt="" fill className="object-contain" priority={false} />
        </div>

        <div className="relative grid grid-cols-[677px_1fr] gap-[40px]">
          {/* request form */}
          <div>
            <h2 className="max-w-[611px] text-[52px] font-semibold leading-[0.9] tracking-[-0.01em]">
              {footer.formTitle[0]} {footer.formTitle[1]}
              <br />
              {footer.formTitle[2]}
            </h2>

            <div className="mt-[32px] flex flex-col gap-[12px]">
              <div className="grid grid-cols-2 gap-[12px]">
                <Field label={footer.fields.name} value={form.name} onChange={set('name')} />
                <Field label={footer.fields.company} value={form.company} onChange={set('company')} />
              </div>
              <Field label={footer.fields.contact} value={form.contact} onChange={set('contact')} />
              <Field label={footer.fields.brief} value={form.brief} onChange={set('brief')} textarea />

              <button
                type="button"
                className="flex w-fit items-center gap-[10px] py-[4px] text-[16px] font-semibold text-white transition hover:opacity-80"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M21 11 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {footer.attach}
              </button>

              <div className="mt-[8px] flex flex-wrap gap-[12px]">
                {footer.budgets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget((cur) => (cur === b ? '' : b))}
                    className={`h-[52px] rounded-[16px] px-[24px] text-[16px] font-semibold transition ${
                      budget === b
                        ? 'bg-accent text-white'
                        : 'bg-[#201f1f] text-white hover:bg-[#2a2828]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={status === 'sending' || sent}
                className="mt-[20px] h-[60px] rounded-[27px] bg-white text-[16px] font-semibold text-[#040404] transition hover:brightness-95 disabled:opacity-70"
              >
                {sent ? 'Заявка отправлена ✓' : status === 'sending' ? 'Отправляем…' : footer.submit}
              </button>

              {status === 'error' && <p className="text-[13px] text-accent-bright">{error}</p>}

              <label className="mt-[8px] flex cursor-pointer items-center gap-[10px] text-[16px] leading-[1.3] text-[#666]">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="size-[20px] shrink-0 rounded-[6px] accent-accent"
                />
                <span>
                  Отправляя сообщение, вы соглашаетесь с{' '}
                  <span className="underline">политикой обработки персональных данных</span>
                </span>
              </label>
            </div>
          </div>

          {/* manager card sits low on the right, over the fire */}
          <div className="relative flex items-end justify-center pb-[40px]">
            <div className="flex items-center gap-[10px]">
              <span className="size-[54px] shrink-0 overflow-hidden rounded-full">
                <Image src={asset('/figma/mgr-anna.png')} alt={footer.manager.name} width={54} height={54} className="size-full object-cover" />
              </span>
              <span className="leading-tight">
                <span className="block text-[16px] tracking-[0.03em] text-[#f5f7f6]">{footer.manager.name}</span>
                <span className="block text-[14px] text-[#b9b9b9]">{footer.manager.role}</span>
              </span>
              <span className="ml-[6px] grid size-[58px] place-items-center rounded-full bg-accent">
                <Image src={asset('/figma/mgr-tg.svg')} alt="" width={26} height={26} />
              </span>
            </div>
          </div>
        </div>

        {/* contacts + socials in a dark rounded block */}
        <div className="relative mt-[56px] grid grid-cols-[420px_1fr] gap-[40px] rounded-[40px] bg-[#201f1f] p-[55px]">
          <div className="flex flex-col gap-[40px] text-[16px] font-medium tracking-[0.04em]">
            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[6px]">
                <span className="text-white/20">{footer.contacts.email.label}</span>
                <a href={`mailto:${footer.contacts.email.value}`} className="transition hover:text-accent-bright">
                  {footer.contacts.email.value}
                </a>
              </div>
              <div className="flex flex-col gap-[6px]">
                <span className="text-white/20">{footer.contacts.phone.label}</span>
                <a href={`tel:${footer.contacts.phone.value.replace(/[^+\d]/g, '')}`} className="transition hover:text-accent-bright">
                  {footer.contacts.phone.value}
                </a>
              </div>
            </div>
            <span className="uppercase">{footer.contacts.city}</span>
          </div>

          <div>
            <div className="mb-[30px] text-[16px] font-medium tracking-[0.04em] text-white/20">
              {footer.socialsTitle}
            </div>
            <div className="flex flex-wrap gap-[12px]">
              {footer.socials.map((s) => (
                <SocialCard key={s.id} s={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
