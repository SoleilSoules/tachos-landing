// Typographic non-breaking glue. A short Russian preposition/conjunction (1–2
// letters) must never hang at the end of a wrapped line — we bind it to the next
// word with U+00A0. Applied across lib/content.ts via deepNbsp() so the rule
// holds for every string on the site automatically (and for future copy too).

const SHORT_WORD = /(^|[\s(«"„])([A-Za-zА-Яа-яЁё]{1,2})[ \t]+/g;

export function nbsp(text: string): string {
  // Two passes catch back-to-back short words ("и в облаке").
  return text.replace(SHORT_WORD, '$1$2 ').replace(SHORT_WORD, '$1$2 ');
}

// Keys whose values are identifiers / paths / enums — never prose, leave them be.
const SKIP_KEYS = new Set(['id', 'href', 'logo', 'cover', 'avatar', 'src', 'icon', 'kind', 'tone']);

// Deep-clone a content value, running nbsp() over every prose string. The return
// type mirrors the input (literal types survive at the type level; only the
// runtime strings gain non-breaking spaces).
export function deepNbsp<T>(value: T, key?: string): T {
  if (typeof value === 'string') {
    return (key && SKIP_KEYS.has(key) ? value : nbsp(value)) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepNbsp(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepNbsp(v, k);
    return out as unknown as T;
  }
  return value;
}
