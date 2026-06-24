// Tachos Nachos (the mascot) does NOT read an element's label back to the user — he
// says something OF HIS OWN about whatever's under the cursor: a take, an inside fact,
// a nudge. Lines are grouped by the KIND of thing and picked at random (never the same
// one twice in a row) so he feels alive instead of scripted. Verified cases
// (Складно / Хайс / Maginary) get real-fact lines; everything else gets his own riff.

export type NachosCategory =
  | 'case'
  | 'product'
  | 'review'
  | 'role'
  | 'blog'
  | 'hero'
  | 'contact'
  | 'founder'
  | 'generic';

// First token of a "Имя Фамилия · статус" string → just the first name to riff on.
const firstName = (s: string) => {
  const head = s.split(/[·,]/)[0]?.trim() ?? s;
  return head.split(' ')[0] ?? head;
};

// Map an element's data-hint (its TYPE) + data-hint-sub (its ENTITY) to a category and
// the name Nachos will riff on. Unknown elements fall back to a generic clickable.
export function categorize(
  hint: string | null,
  sub: string | null,
): { category: NachosCategory; name: string } {
  const h = (hint ?? '').trim();
  const s = (sub ?? '').trim();
  if (h.startsWith('Кейс:')) return { category: 'case', name: h.replace('Кейс:', '').trim() };
  if (h === 'Наш продукт') return { category: 'product', name: s };
  if (h === 'Отзыв клиента' || h === 'Видео-отзыв')
    return { category: 'review', name: firstName(s) };
  if (h === 'Роль в команде') return { category: 'role', name: s.toLowerCase() };
  if (h === 'Статья студии') return { category: 'blog', name: s };
  if (h.startsWith('Нажмите')) return { category: 'hero', name: '' };
  if (h.startsWith('Сюда придёт')) return { category: 'contact', name: '' };
  if (h.startsWith('Экстренная связь')) return { category: 'founder', name: firstName(s) };
  return { category: 'generic', name: '' };
}

// Real-fact lines for confirmed Tachos work — Nachos drops a detail you can't read off
// the card, not the card's own caption.
const CASE_FACTS: Record<string, string[]> = {
  Складно: [
    'Склад, который работает совсем без людей. Жми — покажу.',
    'Ячейку открываешь телефоном по Bluetooth. И это собрали мы.',
    'Выросли до 95 точек по стране. Неплохо для «без персонала»?',
  ],
  Хайс: [
    'Банк для ИП с нуля. Прямо с самого нуля.',
    'Счёт, бухгалтерия и валюта в одном экране — наших рук дело.',
    'Тут мы ещё и анти-фрод на SDK докрутили. Тихо так.',
  ],
  Maginary: [
    'Эту книгу-игру скачали 750 тысяч раз. Серьёзно.',
    'Читаешь — и сам решаешь, что будет дальше по сюжету.',
    'Целое приложение, где ты — герой. Загляни.',
  ],
};

// His own riff when there's no verified fact — still NOT the caption, it's his take.
const CASE_GENERIC = [
  '{name}? Вот тут мы прям выложились.',
  'За {name} — живая история, не просто красивый скрин.',
  'Жми — расскажу, как мы вытащили {name}.',
  '{name} я бы показал в первую очередь.',
];

const LINES: Record<Exclude<NachosCategory, 'case'>, string[]> = {
  product: [
    'Это мы сделали для себя — и не стыдно показать.',
    'Сами пользуемся этим каждый день, не для галочки.',
    'Внутренний продукт студии, между прочим.',
  ],
  review: [
    '{name} это не за рекламу говорит, честно.',
    'Тут живой голос {name}, не наш копирайтер.',
    '{name} с нами уже не первый год.',
  ],
  role: [
    'Свой {name} в штате — не на подряде.',
    'Да, {name} у нас в команде. Никакого аутсорса.',
    'Этот {name} — живой человек, сидит рядом.',
  ],
  blog: [
    'Мы ещё и писать умеем, не только кодить.',
    'Тут без воды — сами набили эти шишки.',
    'Заметка из практики, а не пересказ умных книжек.',
  ],
  hero: [
    'Начни печатать — я подхвачу остальное.',
    'Опиши задачу как другу, без умных слов.',
    'Не знаешь, с чего начать? Пиши как есть.',
  ],
  contact: [
    'Оставь контакт — и мы точно не потеряемся.',
    'Телега, почта — как тебе удобнее.',
    'Сюда — и ответ прилетит лично тебе.',
  ],
  founder: [
    'Это {name}. Реальный, отвечает сам.',
    '{name} — основатель, на связи без секретарей.',
    'Напишешь сюда — попадёшь прямо к {name}.',
  ],
  generic: ['Сюда интересно, глянь.', 'Тут есть на что посмотреть.', 'Давай, не бойся — жми.'],
};

const fill = (line: string, name: string) => line.replace(/\{name\}/g, name);

// Pick a line for the category, substituting the name, avoiding an exact repeat of the
// previous line so he doesn't echo himself.
export function nachosLine(category: NachosCategory, name: string, avoid?: string): string {
  const pool = category === 'case' ? (CASE_FACTS[name] ?? CASE_GENERIC) : LINES[category];
  const filled = pool.map((l) => fill(l, name));
  const fresh = filled.length > 1 && avoid ? filled.filter((l) => l !== avoid) : filled;
  return fresh[Math.floor(Math.random() * fresh.length)] ?? filled[0] ?? '';
}
