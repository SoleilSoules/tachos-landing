import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cases } from '@/lib/content';
import { CaseView } from '@/components/sections/CaseView';

// Only known cases are valid — anything else 404s (no runtime params on a static
// export anyway).
export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = cases.find((c) => c.id === slug);
  if (!item) return {};
  return {
    title: `${item.client} — кейс Tachos`,
    description: item.story.summary,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = cases.find((c) => c.id === slug);
  if (!item) notFound();

  const others = cases.filter((c) => c.id !== item.id).slice(0, 3);
  return <CaseView item={item} others={others} />;
}
