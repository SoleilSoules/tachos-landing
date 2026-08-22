import { nbspText } from './typography';
// Letter composer model (ported from the v2 prototype). The form builds one
// email for the whole session; the user only picks chips, the text writes itself.

// The five options come from the copy doc's «Варианты первого поля». `unset` is
// not offered anywhere — it is the state before anything is picked, which the
// letter renders as an empty slot.
export type LetterType = 'app' | 'web' | 'backend' | 'internal' | 'other' | 'unset';

const LETTER_TYPES: readonly string[] = ['app', 'web', 'backend', 'internal', 'other', 'unset'];

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
  type: 'unset',
  name: '',
  have: '',
  when: '',
  budget: '',
  freeText: '',
};

export const typeChips: { type: LetterType; label: string }[] = [
  { type: 'app', label: 'мобильное приложение' },
  { type: 'web', label: 'веб-сервис' },
  { type: 'backend', label: 'backend' },
  { type: 'internal', label: 'внутренняя система' },
  { type: 'other', label: 'другое' },
];

// Heuristic from free text → chip highlight + default type on submit.
export function guessType(raw: string): LetterType | null {
  const s = raw.toLowerCase();
  // Order matters: an «интеграция с CRM» must land on the system, not the API.
  if (/приложени|\bапп|ios|android|айфон|мобильн/.test(s)) return 'app';
  if (/crm|erp|админк|админ-панел|внутренн|учет|личный кабинет/.test(s)) return 'internal';
  if (/backend|бэкенд|бекенд|\bapi\b|интеграц|сервер|нагрузк/.test(s)) return 'backend';
  if (
    /сайт|ленд|лэнд|портал|веб|страниц|промо|магазин|маркетплейс|каталог|корзин|еком|e-?com|продават/.test(
      s,
    )
  )
    return 'web';
  if (/игр|game|геймдев|геймификац|gamedev|юнити|unity|unreal/.test(s)) return 'other';
  return null;
}

const freeLine = (s: ComposeState) =>
  s.freeText ? `\nЗадача своими словами: «${s.freeText}».` : '';

const subjects: Record<LetterType, string> = {
  app: 'Нужно мобильное приложение',
  web: 'Нужен веб-сервис',
  backend: 'Нужен backend',
  internal: 'Нужна внутренняя система',
  other: 'Нужна разработка',
  unset: 'Нужна консультация',
};

// «Сейчас …» and «По срокам: …» are shared by every type — only the opening
// sentence and the closing question differ.
const tail = (s: ComposeState) =>
  `${s.have ? ' Сейчас ' + s.have + '.' : ''}${s.when ? ' По срокам: ' + s.when + '.' : ''}`;

const bodies: Record<LetterType, (s: ComposeState) => string> = {
  app: (s) =>
    `Здравствуйте!\n\nНам нужно мобильное приложение.${freeLine(s)}${tail(s)}\n\nХотим обсудить задачу и понять стоимость. Что нужно от нас для первой оценки?`,
  web: (s) =>
    `Здравствуйте!\n\nНам нужен веб-сервис.${freeLine(s)}${tail(s)}\n\nРасскажите, как вы работаете и что нужно от нас для оценки.`,
  backend: (s) =>
    `Здравствуйте!\n\nНам нужен backend: серверная логика, работа с данными и интеграции.${freeLine(s)}${tail(s)}\n\nПодскажите, с чего начнем?`,
  internal: (s) =>
    `Здравствуйте!\n\nНам нужна внутренняя система: админ-панель и процессы команды.${freeLine(s)}${tail(s)}\n\nПодскажите, с чего начнем?`,
  other: (s) =>
    `Здравствуйте!\n\nЕсть задача на разработку.${freeLine(s)}${tail(s)}\n\nГотовы рассказать подробнее — что нужно от нас для оценки?`,
  unset: (s) =>
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

export const COMPOSE_DRAFT_KEY = 'tachos_compose_draft_v2';

export const composeQuestions = {
  have: {
    label: 'Что у вас сейчас?',
    options: [
      { v: 'есть только идея', label: 'Есть только идея' },
      { v: 'уже есть продукт', label: 'Уже есть продукт' },
      { v: 'нужно переделать существующее решение', label: 'Нужно переделать' },
      { v: 'нужна команда для развития', label: 'Нужна команда' },
      { v: 'пока не знаем, с чего начать', label: 'Пока не знаем' },
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
