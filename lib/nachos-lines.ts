// Tachos Nachos (the mascot) explains the thing under the cursor. One rule, set
// by Гоша after he caught him riffing into the void: every line must ADD
// information about that exact element — a fact you can't read off the card. No
// personality riffs, no «you came back» lines, no teasing the user into a click.
//
// When there is nothing specific to say, he says NOTHING: nachosLine returns
// null and the companion keeps quiet. A generic line over an unknown element is
// exactly what read as random.
//
// Facts come from lib/content.ts and the real projects — nothing invented.

export type NachosCategory =
  | 'case'
  | 'product'
  | 'switcher'
  | 'review'
  | 'player'
  | 'role'
  | 'blog'
  | 'hero'
  | 'voice'
  | 'send'
  | 'contact'
  | 'founder'
  | 'nav'
  | 'nav-cta'
  | 'logo'
  | 'tab'
  | 'more-cases'
  | 'studio'
  | 'footer-mail'
  | 'footer-phone'
  | 'manager'
  | 'rodina'
  | 'floating'
  | 'generic';

// First token of a "Имя Фамилия · статус" string → just the first name.
const firstName = (s: string) => {
  const head = s.split(/[·,]/)[0]?.trim() ?? s;
  return head.split(' ')[0] ?? head;
};

const KNOWN = new Set<NachosCategory>([
  'case',
  'product',
  'switcher',
  'review',
  'player',
  'role',
  'blog',
  'hero',
  'voice',
  'send',
  'contact',
  'founder',
  'nav',
  'nav-cta',
  'logo',
  'tab',
  'more-cases',
  'studio',
  'footer-mail',
  'footer-phone',
  'manager',
  'rodina',
  'floating',
]);

// data-hint = machine category key, data-hint-sub = the entity to describe.
export function categorize(
  hint: string | null,
  sub: string | null,
): { category: NachosCategory; name: string } {
  const h = (hint ?? '').trim() as NachosCategory;
  const s = (sub ?? '').trim();
  if (!KNOWN.has(h)) return { category: 'generic', name: '' };
  if (h === 'review' || h === 'founder') return { category: h, name: firstName(s) };
  if (h === 'role') return { category: h, name: s.toLowerCase() };
  return { category: h, name: s };
}

// ─── Per-entity facts ──────────────────────────────────────────────────────
const CASE_FACTS: Record<string, string[]> = {
  Складно: [
    'Сеть хранения без сотрудников: ячейка открывается телефоном по Bluetooth',
    '95 точек и 8 000 пользователей — бронь, оплата и доступ в приложении',
    'Мобильное приложение под iOS и Android плюс бэкенд к нему',
  ],
  Хайс: [
    'Мобильный банк для ИП: счет, бухгалтерия и валюта в одном приложении',
    'Собран с нуля — нативные приложения под iOS и Android',
    'Анти-фрод доработан на уровне SDK, внутри самого приложения',
  ],
  Maginary: [
    'Книга-игра: читатель принимает решения и меняет ход сюжета',
    '750 000 загрузок в App Store',
    'Нативное iOS-приложение с анимированными сценами и ветвлением',
  ],
  Monte: [
    'Сайт и цифровые сервисы для студии автотюнинга',
    'У них приборы Monte GT и GTR, за нами вся цифровая часть',
  ],
  Добрый: [
    'Промо-игра прямо в браузере, без установки',
    'От идеи до релиза — четыре недели',
    'Игра для бренда №1 на рынке соков России',
  ],
};

const PRODUCT_LINES: Record<string, string[]> = {
  doki: [
    'Платформа управления документацией — наш собственный продукт',
    'Сделали, чтобы навести порядок в своих же документах',
  ],
  hub: [
    'Складской учет: приемка, остатки и логистика в одном окне',
    'Заменил таблицы на реальном складе',
  ],
  standby: [
    'Доска фокуса: задачи, таймеры и прогресс в реальном времени',
    'Наш внутренний инструмент, которым пользуемся каждый день',
  ],
};

// What each role actually does on a project.
const ROLE_LINES: Record<string, string[]> = {
  'продуктовый ux/ui дизайнер': ['Собирает интерфейс: от логики экранов до макета'],
  'арт-директор': ['Отвечает за визуальный язык проекта целиком'],
  'дизайн-директор': ['Держит единый уровень качества на всех проектах студии'],
  'frontend-разработчик': ['Собирает интерфейс в браузере — то, что вы сейчас видите'],
  'backend-разработчик': ['Данные, интеграции и нагрузка — все, чего не видно с экрана'],
  'системный аналитик': ['Переводит бизнес-задачу в техническое задание'],
  'продуктовый аналитик': ['Считает, что в продукте работает, а что нет'],
  'qa-специалист': ['Ломает продукт до релиза, чтобы он не сломался после'],
  'devops-инженер': ['Сборка, деплой и мониторинг — релиз без сюрпризов'],
};

const BLOG_LINES: Record<string, string[]> = {
  'igra-dlya-dobrogo': ['Как собрали промо-игру за четыре недели'],
  'razrabotka-ne-utopia': ['Про наш процесс: фикс-прайс, сроки в договоре, демо на каждом этапе'],
  'ustroistvo-dlya-drifta': ['Бортовое устройство для дрифтеров: железо плюс приложение'],
};

const NAV_LINES: Record<string, string[]> = {
  Кейсы: ['Проекты, которые довели до прода'],
  Отзывы: ['Говорят сами клиенты — аудио, видео и текст'],
  Контакты: ['Письмо собирается само: выбираете ответы, текст пишется за вас'],
  Медиа: ['Статьи о процессе и жизни студии'],
};

// Flat pools for everything that isn't per-entity.
const LINES: Record<
  Exclude<NachosCategory, 'case' | 'product' | 'role' | 'blog' | 'nav' | 'generic'>,
  string[]
> = {
  switcher: ['Переключает между нашими собственными продуктами'],
  review: [
    'Отзыв от первого лица — записан клиентом, не переписан копирайтером',
    'Клиент студии, работаем вместе не первый год',
  ],
  player: [
    'Аудио-отзыв: play запускает, по волне можно перематывать',
    'Пока играет, я показываю расшифровку',
  ],
  hero: [
    'Опишите задачу своими словами — из ответов соберется письмо',
    'Формулировать по ТЗ не нужно, достаточно пары фраз',
  ],
  voice: ['Голосовой ввод: продиктуйте задачу вместо набора'],
  send: ['Откроет письмо с вашим текстом. Enter работает так же'],
  contact: ['Сюда придет ответ: телефон, почта или телеграм'],
  founder: ['{name} — основатель и тех-лид, отвечает напрямую, без менеджеров'],
  'nav-cta': ['Открывает письмо в студию, ответ в течение рабочего дня'],
  logo: ['Tachos — студия разработки и дизайна из Волгограда'],
  tab: ['Фильтр по направлению: {name}'],
  'more-cases': ['Показывает остальные кейсы'],
  studio: ['Съемка нашего офиса, а не сток'],
  'footer-mail': ['Клик копирует адрес в буфер обмена'],
  'footer-phone': ['Клик копирует номер в буфер обмена'],
  manager: ['Анна читает письма из этой формы и отвечает на них'],
  rodina: ['Родина-мать, Волгоград — здесь и находится студия'],
  floating: ['Собрать письмо в студию — занимает около 20 секунд'],
};

const fill = (line: string, name: string) => line.replace(/\{name\}/g, name);

function pool(category: NachosCategory, name: string): string[] | null {
  switch (category) {
    case 'generic':
      return null; // nothing specific to say → stay quiet
    case 'case':
      return CASE_FACTS[name] ?? null;
    case 'product':
      return PRODUCT_LINES[name] ?? null;
    case 'role':
      return ROLE_LINES[name] ?? null;
    case 'blog':
      return BLOG_LINES[name] ?? null;
    case 'nav':
      return NAV_LINES[name] ?? null;
    default:
      return LINES[category];
  }
}

// A line describing this element, or null when there's nothing to add.
export function nachosLine(category: NachosCategory, name: string, avoid?: string): string | null {
  const source = pool(category, name);
  if (!source || source.length === 0) return null;
  const filled = source.map((l) => fill(l, name));
  const fresh = filled.length > 1 && avoid ? filled.filter((l) => l !== avoid) : filled;
  return fresh[Math.floor(Math.random() * fresh.length)] ?? filled[0] ?? null;
}
