import { nbspText } from './typography';
// Letter composer model (ported from the v2 prototype). The form builds one
// email for the whole session; the user only picks chips, the text writes itself.

export type LetterType = 'site' | 'app' | 'shop' | 'game' | 'idk';

const LETTER_TYPES: readonly string[] = ['site', 'app', 'shop', 'game', 'idk'];

// Letter types arrive as raw strings from the DOM (`data-compose`), the URL
// (?compose=) and localStorage drafts — none of which TypeScript can vouch for.
// An unknown value used to reach buildLetter and crash it (bodies[type] is
// undefined → not a function), taking the whole letter down.
export function isLetterType(v: unknown): v is LetterType {
  return typeof v === 'string' && LETTER_TYPES.includes(v);
}

export type ComposeState = {
  type: LetterType;
  name: string;
  have: string;
  when: string;
  budget: string;
  freeText: string;
};

export const initialCompose: ComposeState = {
  type: 'idk',
  name: '',
  have: '',
  when: '',
  budget: '',
  freeText: '',
};

export const typeChips: { type: LetterType; label: string }[] = [
  { type: 'site', label: 'Сайт' },
  { type: 'app', label: 'Приложение' },
  { type: 'shop', label: 'Магазин' },
  { type: 'game', label: 'Игра' },
  { type: 'idk', label: 'Не знаю' },
];

// Heuristic from free text → chip highlight + default type on submit.
export function guessType(raw: string): LetterType | null {
  const s = raw.toLowerCase();
  if (/сайт|ленд|лэнд|портал|веб|страниц|промо/.test(s)) return 'site';
  if (/приложени|\bапп|ios|android|айфон|мобильн/.test(s)) return 'app';
  if (/магазин|маркетплейс|каталог|корзин|еком|e-?com|продават/.test(s)) return 'shop';
  if (/игр|game|геймдев|gamedev|юнити|unity|unreal/.test(s)) return 'game';
  return null;
}

const freeLine = (s: ComposeState) =>
  s.freeText ? `\nЗадача своими словами: «${s.freeText}».` : '';

const subjects: Record<LetterType, string> = {
  site: 'Нужен сайт',
  app: 'Нужно мобильное приложение',
  shop: 'Нужен интернет-магазин',
  game: 'Нужна игра',
  idk: 'Нужна консультация',
};

const bodies: Record<LetterType, (s: ComposeState) => string> = {
  site: (s) =>
    `Здравствуйте!\n\nМне нужен сайт для компании.${freeLine(s)}${s.have ? ' Сейчас ' + s.have + '.' : ''}${s.when ? ' По срокам: ' + s.when + '.' : ''}\n\nРасскажите, как вы работаете и что нужно от нас для оценки.`,
  app: (s) =>
    `Здравствуйте!\n\nНам нужно мобильное приложение${s.have ? ' — сейчас ' + s.have : ''}.${freeLine(s)}${s.when ? ' По срокам: ' + s.when + '.' : ''}\n\nХотим обсудить задачу и понять стоимость. Что нужно от нас для первой оценки?`,
  shop: (s) =>
    `Здравствуйте!\n\nНам нужен интернет-магазин: каталог, корзина, оплата.${freeLine(s)}${s.have ? ' Сейчас ' + s.have + '.' : ''}${s.when ? ' По срокам: ' + s.when + '.' : ''}\n\nПодскажите, с чего начнем?`,
  game: (s) =>
    `Здравствуйте!\n\nХотим сделать игру.${freeLine(s)}${s.have ? ' Сейчас ' + s.have + '.' : ''}${s.when ? ' По срокам: ' + s.when + '.' : ''}\n\nГотовы рассказать о задумке на созвоне — что нужно от нас для оценки?`,
  idk: (s) =>
    s.freeText
      ? `Здравствуйте!\n\nЗадача своими словами: «${s.freeText}».${s.when ? '\nПо срокам: ' + s.when + '.' : ''}\n\nПодскажете, как к этому подойти и сколько это может стоить?`
      : `Здравствуйте!\n\nЕсть задача, но не знаю, как ее правильно назвать — нужна консультация. Подскажете, что подойдет?${s.when ? ' По срокам: ' + s.when + '.' : ''}\n\nКак удобнее обсудить?`,
};

export function buildLetter(s: ComposeState): { subject: string; body: string } {
  let body = bodies[s.type](s) + (s.budget ? `\n\nОриентир по бюджету: ${s.budget}.` : '');
  // Personalise the greeting with the name slot when the visitor filled it.
  if (s.name) body = body.replace('Здравствуйте!', `Здравствуйте! Меня зовут ${s.name}.`);
  // the letter is typed into a narrow sheet — glue short prepositions like the rest
  // of the site's copy, so nothing hangs at a line end while it types out
  return { subject: subjects[s.type], body: nbspText(body) };
}

// Lenient contact check — the goal is to reject obvious typos, not real contacts.
export type ContactError = 'empty' | 'invalid' | null;

export function validateContact(v: string): ContactError {
  const s = v.trim();
  if (!s) return 'empty';
  if (s.startsWith('@') && s.length >= 2) return null; // @telegram
  if (/[^@\s]+@[^@\s]+\.[^@\s]+/.test(s)) return null; // email
  if (/^[+]?[\d\s\-().]{7,18}$/.test(s)) return null; // phone
  return 'invalid';
}

export const COMPOSE_DRAFT_KEY = 'tachos_compose_draft_v1';

export const composeQuestions = {
  have: {
    label: 'Что у вас сейчас?',
    options: [
      { v: 'ничего нет — начинаем с нуля', label: 'Ничего нет' },
      { v: 'есть старый — нужен новый', label: 'Есть старый' },
      { v: '', label: 'Пропустить' },
    ],
  },
  when: {
    label: 'Сроки',
    options: [
      { v: 'горит — нужно быстро', label: 'Горит' },
      { v: 'в этом квартале', label: 'В этом квартале' },
      { v: '', label: 'Не определились' },
    ],
  },
  budget: {
    label: 'Бюджет — необязательно',
    options: [
      { v: '', label: 'Пока не знаю' },
      { v: '1–2 млн ₽', label: '1–2 млн' },
      { v: '3–4 млн ₽', label: '3–4 млн' },
      { v: '5–10 млн ₽', label: '5–10 млн' },
      { v: '10+ млн ₽', label: '10+ млн' },
    ],
  },
} as const;
