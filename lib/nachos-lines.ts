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
    'Склад совсем без людей — ячейку открываешь телефоном по Bluetooth.',
    'Доросли до 95 точек по стране. И ни одного кладовщика.',
    'Бронь, оплата, доступ — всё в приложении. Это мы собрали.',
  ],
  Хайс: [
    'Банк для ИП. Собрали с чистого листа — счёт, бухгалтерия, валюта.',
    'Анти-фрод зашили прямо в SDK. Тихо работает, надёжно.',
    'Всё, что ИП нужно от банка, — в одном экране. Наших рук дело.',
  ],
  Maginary: [
    'Книга, где ты сам решаешь сюжет. 750 тысяч скачали — не шутка.',
    'Целое приложение, где читатель — герой. Тапни, покажу.',
    'Анимированная книга-игра под iOS. Мы её и собрали.',
  ],
};

// His own riff when there's no verified fact — still NOT the caption, it's his take.
const CASE_GENERIC = [
  '{name}? За этим я слежу лично.',
  'Тут живая история, а не красивый скрин. Жми.',
  'За {name} мы попотели — оно того стоило.',
  '{name} я бы показал в первую очередь.',
];

const LINES: Record<Exclude<NachosCategory, 'case'>, string[]> = {
  product: [
    'Это мы сварганили для себя. И гордимся.',
    'Сами на этом сидим каждый день, не для витрины.',
    'Наш продукт. Рабочая лошадка, а не показуха.',
  ],
  review: [
    'Это {name} сам сказал — не наш копирайтер.',
    '{name} тут без прикрас. Живой человек.',
    '{name} с нами давно. Лишнего не наговорит.',
  ],
  role: [
    'Свой {name}, живьём. Никакого аутсорса.',
    '{name} сидит через стол от меня. Честно.',
    'Да, {name} у нас в штате, не на подряде.',
  ],
  blog: [
    'Мы и писать умеем, не только код гонять.',
    'Тут по делу — сами эти шишки набили.',
    'Без воды. Из практики, а не из умной книжки.',
  ],
  hero: [
    'Печатай как есть — дальше моя забота.',
    'Опиши задачу по-человечески, без умных слов.',
    'Не знаешь, с чего начать? Просто начни.',
  ],
  contact: [
    'Кинь контакт — не потеряю, обещаю.',
    'Телега, почта — как тебе удобнее.',
    'Сюда — и ответ прилетит лично тебе.',
  ],
  founder: [
    'Это {name}, живьём. Отвечает сам.',
    '{name} — основатель. Без секретарей и прослоек.',
    'Напишешь сюда — попадёшь прямо к {name}.',
  ],
  generic: [
    'О, сюда ткни — не пожалеешь.',
    'Тут кое-что припрятано. Глянь.',
    'Это стоит клика, зуб даю.',
    'Смелее, я рядом.',
  ],
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
