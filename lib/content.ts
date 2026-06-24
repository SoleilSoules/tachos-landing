// Single source of content for the landing. All copy and placeholder data lives
// here so sections stay markup-only. Numbers/cases are placeholders until Vadim
// confirms them (verified Tachos work: Складно, Хайс, Maginary only).
//
// Prose is piped through deepNbsp() so short prepositions/conjunctions never hang
// at the end of a wrapped line (see lib/typography.ts).

import { deepNbsp } from './typography';

type NavLink = { label: string; href: string };

export const nav: { links: NavLink[]; cta: string } = {
  links: [
    { label: 'Кейсы', href: '#cases' },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'Контакты', href: '#contacts' },
    { label: 'Медиа', href: '#media' },
  ],
  cta: 'Связаться',
};

export const hero = deepNbsp({
  title: ['Стоим за сильными', 'продуктами и брендами'],
  subhead: {
    lead: 'Студия инжиниринга и дизайна.',
    rest: 'Проектируем и собираем веб и мобильные продукты для фаундеров и компаний — от идеи до релиза в проде',
  },
  // Proof line woven into the hero copy (not a separate stat-bar): `accent` is the
  // verifiable figure (rendered in accent colour), `tail` is the plain noun.
  // Numbers come from real cases (Складно / Хайс / Maginary).
  facts: [
    { accent: '750 000', tail: 'загрузок' },
    { accent: '95+', tail: 'точек сети' },
    { accent: 'банк для ИП', tail: 'с нуля' },
    { accent: '2+ года', tail: 'с командами' },
  ],
  inputPlaceholder: 'Опишите задачу',
  needLabel: 'Мне нужен:',
  chips: ['Сайт', 'Приложение', 'Магазин', 'Игра'],
} as const);

export type Client = { name: string; logo: string; height: number };

// Logo wall. Heights mirror the Figma row. Set is placeholder — verify with Vadim.
// Heights tuned to a shared optical baseline so the row reads as one weight.
export const clients: Client[] = [
  { name: 'Admitad', logo: '/logos/admitad.svg', height: 26 },
  { name: 'Лукойл', logo: '/logos/lukoil.svg', height: 23 },
  { name: 'Monte', logo: '/logos/monte.svg', height: 24 },
  { name: 'Добрый', logo: '/logos/dobry-color.svg', height: 28 },
  { name: 'Складно', logo: '/logos/skladno.svg', height: 26 },
  { name: 'Хайс', logo: '/logos/hais-mono.svg', height: 25 },
];

export const founder = deepNbsp({
  heading: ['Для экстренных вопросов', 'вы можете связаться', 'с основателем студии'],
  facts: ['Тех лид во всех проектах — сам пишу код', 'На связи напрямую, без аккаунт-менеджеров'],
  contactCta: 'Написать Вадиму',
  presentation: { label: 'Презентация Вадима', duration: '0:34' },
  person: { name: 'Вадим Вадимов', role: 'Head of product' },
} as const);

export const casesIntro = deepNbsp({
  titleBlack: 'Успешно запустили',
  titleAccent: { prefix: 'более ', count: 40, suffix: ' цифровых продуктов' },
  body: [
    'Считаем продукт цифрами: загрузки, точки сети, сроки до релиза.',
    'Свой штат и тех-лид в каждом проекте — без подряда.',
    'Ниже — истории, где это уже сработало',
  ],
} as const);

export type CaseTab = { label: string; count?: number; icon?: 'star'; active?: boolean };

// Counts are derived from the cases at render time (CasesExplorer), not hardcoded.
export const caseTabs: CaseTab[] = [
  { label: 'Все', active: true },
  { label: 'Для банков' },
  { label: 'eCommerce' },
  { label: 'Для маркетплейсов' },
  { label: 'Геймдев' },
];

export type CaseStory = {
  summary: string; // 1–2 sentences under the case-page title
  metrics: { value: string; label: string }[]; // 2–3 headline figures
  sections: { title: string; body: string }[]; // context / what we did / result
};

export type CaseItem = {
  id: string;
  client: string;
  category: string;
  desc: { lead: string; highlight: string; tail: string };
  tags: [string, string];
  cover: string;
  avatar: string;
  shot?: string; // real product screenshot, shown in a device mockup on the cover
  shotKind?: 'phone' | 'desktop'; // which premium mockup frame to use for `shot`
  tabs?: string[]; // CaseTab labels this case belongs to (drives tab filtering)
  coverVideo?: string; // Remotion-rendered animated cover (overrides the static mockup)
  mockupVideo?: string; // clip shown inside an animated turning iPhone mockup on the cover
  story: CaseStory; // case-page content (placeholder prose until Vadim confirms)
  verified?: boolean; // confirmed Tachos work (Складно / Хайс / Maginary)
};

// Content ported from the v2 prototype. Covers/avatars are shared placeholders
// (cards blur them into glass); real per-case media comes from Vadim.
const cover = '/figma/case-cover.png';
const avatar = '/figma/case-avatar.png';

export type Review = {
  id: string;
  kind: 'audio' | 'text' | 'video';
  tone: 'dark' | 'accent' | 'light';
  author: string;
  role: string;
  text?: string;
  caption?: string; // e.g. "о своём кейсе"
  duration?: string;
  logo?: string;
};

// Copy tied to real Tachos work (Хайс / Складно / Maginary). Names are placeholders.
export const reviews = deepNbsp({
  title: 'Отзывы клиентов',
  subtitle: 'С этими командами мы работаем уже больше 2 лет',
  items: [
    {
      id: 'r1',
      kind: 'audio',
      tone: 'dark',
      author: 'Полина Никонова',
      role: 'Продакт-директор, Хайс',
      text: 'Доработка SDK на iOS и Android для анти-фрод сервиса банковских организаций',
      duration: '05:59',
      logo: '/logos/hais-mono.svg',
    },
    {
      id: 'r2',
      kind: 'text',
      tone: 'dark',
      author: 'Глеб Волков',
      role: 'CTO, Складно',
      text: 'Подготовка инфраструктуры для микросервисной архитектуры и настройка SSO на проекте с применением self-hosted компонентов',
      logo: '/logos/skladno.svg',
    },
    {
      id: 'r3',
      kind: 'video',
      tone: 'accent',
      author: 'Глеб Волков',
      role: 'CTO, Складно',
      caption: 'о своём кейсе',
      logo: '/logos/skladno.svg',
    },
    {
      id: 'r4',
      kind: 'text',
      tone: 'light',
      author: 'Полина Никонова',
      role: 'Продакт-директор, Хайс',
      text: 'Мобильный банк для ИП с нуля — счёт, бухгалтерия и валюта в одном приложении',
      logo: '/logos/hais-mono.svg',
    },
    {
      id: 'r5',
      kind: 'video',
      tone: 'dark',
      author: 'Дарья Зайцева',
      role: 'Основатель, Maginary',
      caption: 'о своём кейсе',
      duration: '01:48',
    },
  ] as Review[],
});

// ── Order + selection set by Гоша for the homepage grid (2 cols × 5 rows):
//   АльфаСтрахование · Хайс / Складно · Anomalia / Imast · Docmed /
//   Maginary · Добрый / Alma · Monte
// New clients have real screenshots pending — they show an EMPTY device mock
// (shotKind without shot) until the shot is captured. Their story/metrics are
// placeholders ("—") until Vadim confirms copy. Verified work: Складно/Хайс/Maginary.
export const cases: CaseItem[] = deepNbsp<CaseItem[]>([
  {
    id: 'alfastrah',
    client: 'АльфаСтрахование',
    category: 'страхование',
    tabs: ['Для банков'],
    desc: { lead: 'Цифровые сервисы для', highlight: 'страховой компании', tail: '' },
    tags: ['Страхование', 'Web'],
    cover,
    avatar,
    shotKind: 'desktop',
    story: {
      summary: 'Цифровые сервисы для страховой компании.',
      metrics: [
        { value: '—', label: 'уточняется' },
        { value: '—', label: 'уточняется' },
      ],
      sections: [{ title: 'Контекст', body: 'Описание кейса уточняется.' }],
    },
  },
  {
    id: 'hais',
    client: 'Хайс',
    category: 'финтех',
    tabs: ['Для банков'],
    desc: {
      lead: 'Мобильный банк для ИП с нуля —',
      highlight: 'счёт, бухгалтерия и валюта',
      tail: 'в одном приложении',
    },
    tags: ['Финтех', 'iOS + Android'],
    cover,
    avatar,
    shot: '/figma/shots/hais.png',
    shotKind: 'desktop',
    story: {
      summary: 'Мобильный банк для ИП с нуля — счёт, бухгалтерия и валюта в одном приложении.',
      metrics: [
        { value: 'с нуля', label: 'банк под ключ' },
        { value: 'iOS + Android', label: 'нативные приложения' },
        { value: 'анти-фрод', label: 'доработка SDK' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Финтех-команда строила мобильный банк для индивидуальных предпринимателей: счёт, бухгалтерия и мультивалютность в одном приложении.',
        },
        {
          title: 'Что сделали',
          body: 'Спроектировали и собрали нативные приложения под iOS и Android, доработали SDK для анти-фрод сервиса банковских организаций, подготовили инфраструктуру под нагрузку.',
        },
        {
          title: 'Результат',
          body: 'Запустили мобильный банк для ИП — счёт, бухгалтерия и валюта в едином интерфейсе, с защитой от мошенничества на уровне SDK.',
        },
      ],
    },
    verified: true,
  },
  {
    id: 'skladno',
    client: 'Складно',
    category: 'сервис хранения',
    tabs: ['eCommerce'],
    desc: {
      lead: 'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — всё в приложении.',
      highlight: '95+ точек, 8 000 пользователей',
      tail: '',
    },
    tags: ['Сервис хранения', 'Mobile + бэкенд'],
    cover,
    avatar,
    shot: '/figma/shots/skladno.png',
    shotKind: 'phone',
    story: {
      summary:
        'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — всё в приложении.',
      metrics: [
        { value: '95+', label: 'точек сети' },
        { value: '8 000', label: 'активных пользователей' },
        { value: 'Bluetooth', label: 'доступ к ячейке' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Клиент запускал сеть автоматизированных складов хранения без сотрудников на точках. Нужно было приложение, которое закрывает весь путь: найти точку, забронировать ячейку, оплатить и открыть дверь — без участия персонала.',
        },
        {
          title: 'Что сделали',
          body: 'Собрали мобильное приложение под iOS и Android и бэкенд к нему: карта точек, бронирование и оплата, открытие ячейки по Bluetooth, статусы аренды и push-уведомления.',
        },
        {
          title: 'Результат',
          body: 'Сеть выросла до 95+ точек и 8 000 пользователей. Доступ по Bluetooth убрал необходимость держать сотрудников на точках.',
        },
      ],
    },
    verified: true,
  },
  {
    id: 'anomalia',
    client: 'Anomalia',
    category: 'цифровой продукт',
    desc: { lead: '', highlight: 'Anomalia', tail: '— цифровой продукт' },
    tags: ['Цифровой продукт', 'Разработка'],
    cover,
    avatar,
    shot: '/figma/shots/anomalia.png',
    shotKind: 'desktop',
    story: {
      summary: 'Anomalia — цифровой продукт.',
      metrics: [
        { value: '—', label: 'уточняется' },
        { value: '—', label: 'уточняется' },
      ],
      sections: [{ title: 'Контекст', body: 'Описание кейса уточняется.' }],
    },
  },
  {
    id: 'imast',
    client: 'Imast',
    category: 'благотворительность',
    tabs: ['eCommerce'],
    desc: { lead: 'Платформа', highlight: 'благотворительных донатов', tail: '' },
    tags: ['Благотворительность', 'Mobile'],
    cover,
    avatar,
    shot: '/figma/shots/imast.png',
    shotKind: 'desktop',
    story: {
      summary: 'Платформа благотворительных донатов.',
      metrics: [
        { value: '—', label: 'уточняется' },
        { value: '—', label: 'уточняется' },
      ],
      sections: [{ title: 'Контекст', body: 'Описание кейса уточняется.' }],
    },
  },
  {
    id: 'docmed',
    client: 'Docmed',
    category: 'медтех',
    tabs: ['Для маркетплейсов'],
    desc: {
      lead: 'Телемедицина и запись к врачу для',
      highlight: 'клиники доказательной медицины',
      tail: '',
    },
    tags: ['Медтех', 'Web + mobile'],
    cover,
    avatar,
    shotKind: 'desktop',
    story: {
      summary: 'Телемедицина и запись к врачу для клиники доказательной медицины.',
      metrics: [
        { value: '—', label: 'уточняется' },
        { value: '—', label: 'уточняется' },
      ],
      sections: [{ title: 'Контекст', body: 'Описание кейса уточняется.' }],
    },
  },
  {
    id: 'maginary',
    client: 'Maginary',
    category: 'приложение-книга',
    tabs: ['Геймдев'],
    desc: {
      lead: 'Анимированная книга-игра, где читатель становится героем.',
      highlight: '750 000 загрузок',
      tail: 'в App Store',
    },
    tags: ['Приложение-книга', 'iOS'],
    cover,
    avatar,
    shot: '/figma/shots/maginary.png',
    shotKind: 'phone',
    mockupVideo: '/figma/maginary-demo.mp4',
    story: {
      summary: 'Анимированная книга-игра, где читатель становится героем истории.',
      metrics: [
        { value: '750 000', label: 'загрузок в App Store' },
        { value: 'iOS', label: 'нативное приложение' },
        { value: 'книга-игра', label: 'формат продукта' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Студия делала интерактивную книгу-игру: вместо линейного чтения пользователь принимает решения и влияет на сюжет, а сцены оживают анимацией.',
        },
        {
          title: 'Что сделали',
          body: 'Собрали нативное iOS-приложение с анимированными сценами, ветвлением сюжета и плавными переходами между главами.',
        },
        { title: 'Результат', body: 'Приложение набрало 750 000 загрузок в App Store.' },
      ],
    },
    verified: true,
  },
  {
    id: 'dobry',
    client: 'Добрый',
    category: 'FMCG',
    tabs: ['Геймдев'],
    desc: {
      lead: '',
      highlight: 'Игра за месяц: от идеи до прода',
      tail: 'для бренда №1 на рынке соков России',
    },
    tags: ['Web-игра', '4 недели'],
    cover,
    avatar,
    shot: '/figma/shots/dobry.png',
    shotKind: 'desktop',
    story: {
      summary: 'Промо-игра для бренда №1 на рынке соков России — от идеи до прода за месяц.',
      metrics: [
        { value: '4 недели', label: 'от идеи до релиза' },
        { value: 'Web-игра', label: 'формат' },
        { value: '№1', label: 'бренд соков в РФ' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Бренду нужна была промо-механика к кампании: лёгкая веб-игра, в которую можно играть прямо из браузера, без установки.',
        },
        {
          title: 'Что сделали',
          body: 'За четыре недели прошли весь путь — идея, прототип, продакшн и релиз веб-игры, готовой к промо-трафику.',
        },
        {
          title: 'Результат',
          body: 'Игра вышла в срок к запуску кампании бренда №1 на рынке соков России.',
        },
      ],
    },
  },
  {
    id: 'alma',
    client: 'Alma',
    category: 'мобильное приложение',
    desc: { lead: '', highlight: 'Alma', tail: '— мобильное приложение' },
    tags: ['Мобильное приложение', 'iOS + Android'],
    cover,
    avatar,
    shot: '/figma/shots/alma.png',
    shotKind: 'phone',
    story: {
      summary: 'Alma — мобильное приложение.',
      metrics: [
        { value: '—', label: 'уточняется' },
        { value: '—', label: 'уточняется' },
      ],
      sections: [{ title: 'Контекст', body: 'Описание кейса уточняется.' }],
    },
  },
  {
    id: 'monte',
    client: 'Monte',
    category: 'автотюнинг',
    tabs: ['Для маркетплейсов'],
    desc: { lead: 'Сайт и сервисы для', highlight: 'студии автотюнинга', tail: '' },
    tags: ['Автотюнинг', 'Web'],
    cover,
    avatar,
    shot: '/figma/shots/monte.png',
    shotKind: 'desktop',
    story: {
      summary: 'Сайт и сервисы для студии автотюнинга.',
      metrics: [
        { value: '—', label: 'уточняется' },
        { value: '—', label: 'уточняется' },
      ],
      sections: [{ title: 'Контекст', body: 'Описание кейса уточняется.' }],
    },
  },
]);

// ─── Own IT products ───────────────────────────────────────────────
// Real studio products (doki / monte hub / bali betula). Screen + icons are
// drawn in markup; per-product covers come later from Vadim.
export type Product = {
  id: string;
  name: string;
  tagline: string; // one-liner under the name in the switcher
  heading: string; // shown on the device card when active
  body: string;
  cta: string;
};

export const productsIntro = deepNbsp({
  titleLead: 'Создаём собственные ИТ-продукты,',
  titleMuted: 'которыми пользуемся в работе',
} as const);

export const products: Product[] = deepNbsp<Product[]>([
  {
    id: 'doki',
    name: 'doki',
    tagline: 'Система управления доками',
    heading: '«doki» — платформа управления документацией',
    body: 'Must-have для систематизации и устранения хаоса в документах',
    cta: 'Попробовать doki бесплатно',
  },
  {
    id: 'hub',
    name: 'MonteHub',
    tagline: 'Самописный склад',
    heading: '«MonteHub» — система складского учёта',
    body: 'Закрывает приёмку, остатки и логистику в одном окне — без таблиц',
    cta: 'Узнать про MonteHub',
  },
  {
    id: 'balibali',
    name: 'BaliBetula',
    tagline: 'Конструктор ресторанов',
    heading: '«BaliBetula» — конструктор ресторанов',
    body: 'Меню, заказы и QR-обслуживание — всё для заведения из коробки',
    cta: 'Узнать про BaliBetula',
  },
]);

// ─── Blog ──────────────────────────────────────────────────────────
export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  tag: 'Новость' | 'Кейс';
  date: string;
  read: string;
  author: string;
  authorRole: string;
  excerpt: string; // lead line under the title on the post page
  body: BlogBlock[]; // placeholder prose until Vadim confirms
  withImage?: boolean; // the wide right-hand card carries a cover
};

export const blogIntro = deepNbsp({
  title: 'Наш блог',
  body: 'Делимся новостями и экспертизой в разработке. Рассказываем про нас и наш процесс, публикуем кейсы и новости, показываем жизнь студии в «прямом эфире».',
} as const);

export const posts: Post[] = deepNbsp<Post[]>([
  {
    id: 'p1',
    slug: 'igra-dlya-dobrogo',
    title: 'За месяц выпустили игру для Доброго',
    tag: 'Новость',
    date: '16 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    excerpt: 'Промо-веб-игра для бренда №1 на рынке соков — от идеи до прода за четыре недели.',
    body: [
      {
        type: 'p',
        text: 'Бренду нужна была лёгкая механика к рекламной кампании: игра прямо в браузере, без установки. Зашёл — и сразу играешь.',
      },
      { type: 'h', text: 'Почему так быстро' },
      {
        type: 'p',
        text: 'Мы собрали прототип на вайбкоде за пару дней и сразу показали заказчику. Когда механика согласована, остальное — дело техники: продакшн, нагрузочные тесты, релиз.',
      },
      { type: 'quote', text: 'Главное в промо — успеть к запуску кампании. Мы успели с запасом.' },
      {
        type: 'p',
        text: 'Игра выдержала промо-трафик и вышла в срок — для бренда №1 на рынке соков России.',
      },
    ],
  },
  {
    id: 'p2',
    slug: 'razrabotka-ne-utopia',
    title: 'Наша разработка — не утопия',
    tag: 'Кейс',
    date: '20 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    excerpt: 'Рассказываем, как устроен наш процесс — без обещаний, на фактах.',
    body: [
      {
        type: 'p',
        text: 'Часто «разработка под ключ» звучит как утопия: сроки плывут, бюджет растёт, результат не тот. У нас иначе — и вот почему.',
      },
      { type: 'h', text: 'Фикс-прайс и сроки в договоре' },
      {
        type: 'p',
        text: 'Мы фиксируем состав работ и стоимость до старта. Свой штат, без подряда — значит, отвечаем за каждый этап сами.',
      },
      {
        type: 'p',
        text: 'Тех-лид участвует во всех проектах и сам пишет код. Связь напрямую, без прослойки из аккаунт-менеджеров.',
      },
    ],
  },
  {
    id: 'p3',
    slug: 'ustroistvo-dlya-drifta',
    title: 'Сделали бортовое устройство для дрифтеров',
    tag: 'Новость',
    date: '16 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    withImage: true,
    excerpt: 'Собрали диджитал-устройство для дрифт-комьюнити — железо и софт в одной связке.',
    body: [
      {
        type: 'p',
        text: 'Иногда задачи выходят за рамки экрана. Здесь нужно было устройство, которое живёт в машине и общается с приложением.',
      },
      { type: 'h', text: 'Железо плюс софт' },
      {
        type: 'p',
        text: 'Мы не только написали приложение, но и продумали связку с физическим устройством — телеметрия, отклик, синхронизация в реальном времени.',
      },
      { type: 'p', text: 'Получился цельный продукт для дрифт-комьюнити.' },
    ],
  },
]);

// ─── Footer (contacts) ─────────────────────────────────────────────
// The request form is now the inline letter composer (<LetterBody>), so the old
// form/socials copy was removed — only the heading, manager and contacts remain.
export const footer = deepNbsp({
  formTitle: ['Отправьте', 'нам', 'письмо'],
  manager: { name: 'Анна Кузнецова', role: 'Наш менеджер вам ответит' },
  contacts: {
    email: { label: 'E-mail', value: 'hello@tachos.ru' },
    phone: { label: 'Позвонить', value: '+7 930 688-38-38' },
    city: 'город-герой Волгоград',
  },
} as const);

// ─── CTA banner (between Reviews and Services) ─────────────────────
export const ctaBanner = deepNbsp({
  title: 'Обсудить проект — посчитаем и предложим состав работ',
  note: 'Ответим в течение рабочего дня · без рассылок',
  cta: 'Собрать письмо · 20 секунд',
} as const);

// ─── Services / price list ─────────────────────────────────────────
// Prices and feature labels are placeholders until Vadim confirms the
// real numbers (the concept screenshot is too small to read them).
export const servicesIntro = deepNbsp({
  titleLead: 'Делаем сайты, приложения и сервисы',
  titleAccent: 'под ключ.',
  body: 'Не знаете, как назвать задачу, — поможем сформулировать и подберём состав работ. Ниже — направления, с которыми работаем.',
} as const);

export const serviceFeatures: { label: string }[] = deepNbsp<{ label: string }[]>([
  { label: 'Фикс-прайс в договоре' },
  { label: 'Свой штат, без подряда' },
  { label: 'Сроки закреплены' },
  { label: 'Поддержка после релиза' },
  { label: 'NDA по запросу' },
]);

export type Service = { name: string; desc: string; price: string };

export const services: Service[] = deepNbsp<Service[]>([
  {
    name: 'Web Design',
    desc: 'Лендинги, корпоративные сайты, веб-сервисы под ключ',
    price: 'от 400 000 ₽',
  },
  {
    name: 'Mobile Development',
    desc: 'iOS и Android — нативно и кроссплатформенно',
    price: 'от 1 200 000 ₽',
  },
  {
    name: 'Backend & Infrastructure',
    desc: 'API, базы данных, очереди, self-hosted и облако',
    price: 'от 800 000 ₽',
  },
  {
    name: 'Discovery & Analytics',
    desc: 'Исследование, прототип, метрики и аналитика продукта',
    price: 'от 300 000 ₽',
  },
]);

// ─── Thank-you letters (between Products and Blog) ─────────────────
export const lettersIntro = deepNbsp({
  title: 'Благодарственные письма',
  body: 'Официальные отзывы и рекомендательные письма от компаний, с которыми мы работали.',
} as const);

export type Letter = { id: string; tag: string; title: string; text: string };

export const letters: Letter[] = deepNbsp<Letter[]>([
  {
    id: 'l1',
    tag: 'Отзыв',
    title: 'Довели сервис хранения до прода в срок',
    text: 'Команда tachos собрала Складно с нуля — рекомендуем как надёжного подрядчика.',
  },
  {
    id: 'l2',
    tag: 'Отзыв',
    title: 'Доработали мобильный банк без срывов',
    text: 'Глубоко погрузились в задачу и предложили решения, до которых мы сами не дошли. — Хайс',
  },
  {
    id: 'l3',
    tag: 'Отзыв',
    title: 'Книга-игра вышла именно такой',
    text: 'Спасибо за вовлечённость и качество на каждом этапе работы. — Maginary',
  },
]);
