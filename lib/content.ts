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
    // «Медиа» = раздел блога: новости, кейсы и жизнь студии (якоря #media нет)
    { label: 'Медиа', href: '#blog' },
    { label: 'Контакты', href: '#contacts' },
  ],
  cta: 'Связаться',
};

export const hero = deepNbsp({
  title: ['Технологический партнер', 'сильных продуктов и брендов'],
  subhead: {
    rest: 'Проектируем, собираем и развиваем веб и мобильные продукты для фаундеров и компаний — от идеи до релиза в проде',
  },
  // Proof line woven into the hero copy (not a separate stat-bar): `accent` is the
  // verifiable figure (rendered in accent colour), `tail` is the plain noun.
  // Numbers come from real cases (Складно / Хайс / Maginary).
  facts: [
    { accent: '3 млн+', tail: 'установок' },
    { accent: '95+', tail: 'точек сети' },
    { accent: 'банк для ИП', tail: 'с нуля' },
    { accent: '2+ года', tail: 'с командами' },
  ],
  inputPlaceholder: 'Начните описывать задачу, мы поможем',
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
  { name: 'ГАЗ', logo: '/logos/gaz.svg', height: 24 },
  { name: 'Maginary', logo: '/logos/maginary-grunge.svg', height: 24 },
];

// Label above the hero logo grid (bottom-right, filter.im-style composition).
export const trustLabel = 'Нам доверяют';

export const founder = deepNbsp({
  heading: ['Для экстренных вопросов', 'вы можете связаться', 'с основателем студии'],
  facts: ['Тех лид во всех проектах — сам пишу код', 'На связи напрямую, без аккаунт-менеджеров'],
  contactCta: 'Написать Вадиму',
  presentation: { label: 'Презентация Вадима', duration: '0:34' },
  person: { name: 'Вадим Витехновский', role: 'Основатель, тех-лид' },
} as const);

export const casesIntro = deepNbsp({
  titleBlack: 'Успешно запустили',
  titleAccent: { prefix: 'более ', count: 40, suffix: ' цифровых продуктов' },
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

type CaseStory = {
  summary: string; // 1–2 sentences under the case-page title
  metrics: { value: string; label: string }[]; // 2–3 headline figures
  sections: { title: string; body: string }[]; // context / what we did / result
};

export type CaseItem = {
  id: string;
  client: string;
  category: string;
  // `highlight` = accent underlay on the card. Only for a real figure or a
  // strong fact (Гоша) — plain description sentences carry no highlight.
  desc: { lead: string; highlight?: string; tail: string };
  tags: [string, string];
  shot?: string; // real product screenshot, shown in a device mockup on the cover
  shotKind?: 'phone' | 'desktop' | 'cover'; // device frame for `shot`, or 'cover' = full-bleed photo
  coverDark?: boolean; // cover photo is dark → invert overlay chips to light
  tabs?: string[]; // CaseTab labels this case belongs to (drives tab filtering)
  mockupVideo?: string; // clip shown inside an animated turning iPhone mockup on the cover
  coverVideo?: string; // full-bleed animated cover (storyboard reel) — overrides `shot`
  story: CaseStory; // case-page content (placeholder prose until Vadim confirms)
  // Internal marker of work we can vouch for; not rendered anywhere — the case
  // page links to the live product instead of showing a self-issued badge.
  verified?: boolean;
  hidden?: boolean; // temporarily hidden from the homepage grid
};

export type Review = {
  id: string;
  kind: 'audio' | 'text' | 'video';
  tone: 'dark' | 'accent' | 'light';
  author: string;
  role: string;
  text?: string;
  caption?: string; // e.g. "о своем кейсе"
  duration?: string;
  logo?: string;
  // Per-person photo (or a product still when no real photo exists yet). One
  // shared placeholder is NOT allowed: the same face under different names next
  // to each other reads as fake reviews.
  avatar?: string;
};

// Copy tied to real Tachos work (Хайс / Складно / Maginary). Names are placeholders.
export const reviews = deepNbsp({
  title: 'Отзывы клиентов',
  subtitle: 'С этими командами мы работаем уже больше 5 лет',
  items: [
    {
      id: 'r1',
      kind: 'audio',
      tone: 'dark',
      author: 'Полина Никонова',
      role: 'Продакт-директор, Хайс',
      text: 'Анти-фрод SDK на iOS и Android довели до ума так, что я про эту проблему просто перестала думать',
      duration: '05:59',
      logo: '/logos/hais-mono.svg',
      avatar: '/figma/founder-jennifer.png',
    },
    {
      id: 'r2',
      kind: 'text',
      tone: 'dark',
      author: 'Глеб Волков',
      role: 'CTO, Складно',
      text: 'Подняли нам инфраструктуру под микросервисы и SSO на self-hosted. Сами мы возились бы с этим месяцами',
      logo: '/logos/skladno.svg',
      // same face as his video card next to it — one Глеб, one person
      avatar: '/figma/founder-isaac.png',
    },
    {
      id: 'r3',
      kind: 'video',
      tone: 'accent',
      author: 'Глеб Волков',
      role: 'CTO, Складно',
      caption: 'о своем кейсе',
      logo: '/logos/skladno.svg',
      avatar: '/figma/founder-isaac.png',
    },
    {
      id: 'r4',
      kind: 'text',
      tone: 'light',
      author: 'Полина Никонова',
      role: 'Продакт-директор, Хайс',
      text: 'Собрали мобильный банк для ИП с нуля: счет, бухгалтерия и валюта в одном приложении. Ровно как мы задумывали',
      logo: '/logos/hais-mono.svg',
      avatar: '/figma/founder-jennifer.png',
    },
    {
      id: 'r5',
      kind: 'video',
      tone: 'dark',
      author: 'Семен Поляковский',
      role: 'Создатель Maginary',
      caption: 'о своем кейсе',
      duration: '01:48',
      logo: '/logos/maginary-grunge.svg',
      // no real photo of Семен yet — show his product's cover, never someone
      // else's face under a real person's name
      avatar: '/figma/maginary-cover.webp',
    },
  ] as Review[],
});

// ── Order set by Гоша: the first visible four are the animated-cover cases
//   (Monte / Хайс / Maginary / Складно), Добрый moved down to Maginary's old slot.
//   Docmed and АльфаСтрахование were added last (from vadim.tachos.team) so the
//   agreed top of the grid stays put — they surface under «Показать ещё».
// Copy and figures for every case come from Vadim's own site, not from guesses.
export const cases: CaseItem[] = deepNbsp<CaseItem[]>([
  {
    id: 'hais',
    client: 'Хайс',
    category: 'финтех',
    tabs: ['Для банков'],
    desc: {
      lead: 'Мобильный банк для ИП с нуля — счет, бухгалтерия и валюта,',
      highlight: '50 000+ клиентов',
      tail: '',
    },
    tags: ['Финтех', 'iOS + Android'],
    shot: '/figma/hais-cover.webp',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary: 'Мобильный банк для ИП с нуля — счет, бухгалтерия и валюта в одном приложении',
      metrics: [
        { value: '50 000+', label: 'клиентов банка' },
        { value: '6 месяцев', label: 'от старта до MVP' },
        { value: 'iOS + Android', label: 'нативные приложения' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Финтех-команда строила мобильный банк для индивидуальных предпринимателей: счет, бухгалтерия и мультивалютность в одном приложении',
        },
        {
          title: 'Что сделали',
          body: 'Собрали банк с нуля и выпустили MVP для ИП за 6 месяцев, дальше развивали продукт: нативные приложения под iOS и Android, доработка SDK для анти-фрод сервиса, инфраструктура под нагрузку. В 2025 запустили CryptoHub — обмен фиатного рубля на криптовалюту внутри приложения',
        },
        {
          title: 'Результат',
          body: 'Банком пользуются больше 50 000 клиентов: счет, бухгалтерия, валюта и обмен на криптовалюту в одном интерфейсе, с защитой от мошенничества на уровне SDK',
        },
      ],
    },
    verified: true,
  },
  {
    id: 'monte',
    client: 'Monte',
    category: 'автотюнинг',
    tabs: ['Для маркетплейсов'],
    desc: { lead: 'Сайт и сервисы для студии автотюнинга', tail: '' },
    tags: ['Автотюнинг', 'Web'],
    shot: '/figma/monte-cover.webp',
    coverVideo: '/covers/monte-cover.mp4',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary:
        'Собственный продукт: устройство, меняющее характеристики автомобиля, и приложение, которое управляет им по Bluetooth',
      metrics: [
        { value: 'США и Европа', label: 'своя сеть продаж' },
        { value: 'Web + iOS + Android', label: 'платформы' },
        { value: 'Bluetooth', label: 'связь с устройством' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Своя разработка студии: коробка, которая меняет мощность и отклик мотора. Владельцу нужен способ переключать режимы с телефона, а самому продукту — витрина и продажи за рубежом',
        },
        {
          title: 'Что сделали',
          body: 'Сделали цифровую часть продукта: приложения под iOS и Android, которые связываются с устройством по Bluetooth и переключают режимы, плюс сайт и сервисы вокруг продаж',
        },
        {
          title: 'Результат',
          body: 'Устройство производится в США и продается через eBay и Amazon: под продукт построена собственная сеть продаж в США и Европе',
        },
      ],
    },
  },
  {
    id: 'maginary',
    client: 'Maginary',
    category: 'приложение-книга',
    tabs: ['Геймдев'],
    desc: {
      lead: 'Анимированная книга-игра, где читатель становится героем —',
      highlight: '3 млн+ установок',
      tail: 'и Game of the Day в App Store',
    },
    tags: ['Приложение-книга', 'iOS'],
    shot: '/figma/maginary-cover.webp',
    coverVideo: '/covers/maginary-cover.mp4',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary: 'Анимированная книга-игра, где читатель становится героем истории',
      metrics: [
        { value: '3 млн+', label: 'установок в App Store' },
        { value: '40 000', label: 'отзывов' },
        { value: 'Game of the Day', label: 'в App Store' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Студия делала интерактивную книгу-игру: вместо линейного чтения пользователь принимает решения и влияет на сюжет, а сцены оживают анимацией',
        },
        {
          title: 'Что сделали',
          body: 'Собрали нативное iOS-приложение с анимированными сценами, ветвлением сюжета и плавными переходами между главами',
        },
        {
          title: 'Результат',
          body: 'Книга-игра набрала больше 3 млн установок и 40 000 отзывов, App Store поставил ее в Game of the Day',
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
      lead: 'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — все в приложении',
      highlight: '95+ точек, 8 000 пользователей',
      tail: '',
    },
    tags: ['Сервис хранения', 'Mobile + бэкенд'],
    shot: '/figma/skladno-cover.webp',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary:
        'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — все в приложении',
      metrics: [
        { value: '95+', label: 'точек сети' },
        { value: '8 000', label: 'активных пользователей' },
        { value: 'Bluetooth', label: 'доступ к ячейке' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Клиент запускал сеть автоматизированных складов хранения без сотрудников на точках. Нужно было приложение, которое закрывает весь путь: найти точку, забронировать ячейку, оплатить и открыть дверь — без участия персонала',
        },
        {
          title: 'Что сделали',
          body: 'Собрали мобильное приложение под iOS и Android и бэкенд к нему: карта точек, бронирование и оплата, открытие ячейки по Bluetooth, статусы аренды и push-уведомления',
        },
        {
          title: 'Результат',
          body: 'Сеть выросла до 95+ точек и 8 000 пользователей и стала самой быстрорастущей сетью хранения в России. Доступ по Bluetooth убрал необходимость держать сотрудников на точках',
        },
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
    shot: '/figma/dobry-cover.webp',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary: 'Промо-игра для бренда №1 на рынке соков России — от идеи до прода за месяц',
      metrics: [
        { value: '4 недели', label: 'от идеи до релиза' },
        { value: 'Web-игра', label: 'формат' },
        { value: '№1', label: 'бренд соков в РФ' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Бренду нужна была промо-механика к кампании: легкая веб-игра, в которую можно играть прямо из браузера, без установки',
        },
        {
          title: 'Что сделали',
          body: 'За четыре недели прошли весь путь — идея, прототип, продакшн и релиз веб-игры, готовой к промо-трафику',
        },
        {
          title: 'Результат',
          body: 'Игра вышла в срок к запуску кампании бренда №1 на рынке соков России',
        },
      ],
    },
  },
  {
    id: 'anomalia',
    client: 'Anomalia',
    category: 'соцсеть сообщества',
    desc: {
      lead: 'Социальное приложение бизнес-сообщества: деловые связи, чаты и обучение в одном месте',
      tail: '',
    },
    tags: ['Соцсеть', 'iOS + Android'],
    shot: '/figma/anomalia-cover.webp',
    shotKind: 'cover',
    coverDark: true,
    coverVideo: '/covers/anomalia-cover.mp4',
    story: {
      summary:
        'Социальное приложение для участников бизнес-экосистемы: поиск деловых связей, чаты и обучающие материалы',
      metrics: [
        { value: '25 000+', label: 'пользователей' },
        { value: 'iOS + Android', label: 'нативные приложения' },
        { value: 'лента и профили', label: 'ядро продукта' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Большому бизнес-сообществу нужно было собственное место встречи: лента с материалами наставника, обсуждения и понятные профили участников, по которым видно, кто чем может быть полезен',
        },
        {
          title: 'Что сделали',
          body: 'Собрали нативные приложения под iOS и Android: вход по номеру, лента с аудио-постами и опросами, комментарии, профили с навыками и статусами внутри сообщества',
        },
        {
          title: 'Результат',
          body: 'Приложением пользуются больше 25 000 участников сообщества',
        },
      ],
    },
  },
  {
    id: 'imast',
    client: 'IMAST',
    category: 'благотворительность',
    tabs: ['eCommerce'],
    desc: {
      lead: 'Сервис микродонатов — помощь людям через фонды Армении',
      tail: '',
    },
    tags: ['Благотворительность', 'iOS + Android'],
    shot: '/figma/imast-cover.webp',
    shotKind: 'cover',
    // цветная обложка: темный текст в чипах тонул в градиенте — берем светлый вариант
    coverDark: true,
    story: {
      summary: 'Сервис микродонатов: помощь людям через благотворительные фонды Армении',
      metrics: [
        { value: '10 000+', label: 'платящих пользователей в месяц' },
        { value: 'iOS + Android', label: 'нативные приложения' },
        { value: 'микродонаты', label: 'модель сервиса' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Фондам нужен был канал, где помочь можно небольшой суммой и за пару касаний — с проверенными проектами и понятным прогрессом сбора',
        },
        {
          title: 'Что сделали',
          body: 'Собрали приложения под iOS и Android: каталог проверенных проектов по категориям, карточка сбора с целью и прогрессом, оплата в пару шагов',
        },
        {
          title: 'Результат',
          body: 'Сервисом пользуются больше 10 000 платящих пользователей в месяц',
        },
      ],
    },
  },
  {
    id: 'alma',
    client: 'Alma',
    category: 'управление недвижимостью',
    desc: {
      lead: 'SaaS для управляющих компаний: автоматизация управления недвижимостью',
      tail: '',
    },
    tags: ['PropTech', 'Web + mobile'],
    shot: '/figma/alma-cover.webp',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary:
        'SaaS для управляющих компаний: автоматизация управления недвижимостью, локализован для Кипра, Греции и стран MEA',
      metrics: [
        { value: '1 млн+ м²', label: 'под управлением' },
        { value: 'Web + iOS + Android', label: 'платформы' },
        { value: 'Кипр, Греция, MEA', label: 'локализации' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Управляющие компании вели дома в таблицах и переписках: платежи, заявки и общение с жильцами жили в разных местах',
        },
        {
          title: 'Что сделали',
          body: 'Собрали платформу и приложения жильца: платежи и история начислений, заявки и задачи, мессенджер, аналитика по объектам',
        },
        {
          title: 'Результат',
          body: 'Под управлением платформы больше миллиона квадратных метров; продукт локализован для Кипра, Греции и стран MEA',
        },
      ],
    },
  },
  {
    id: 'docmed',
    client: 'Docmed и Docdeti',
    category: 'медтех',
    desc: {
      lead: 'Личный кабинет пациента — запись, результаты и телемедицина в приложении клиники',
      tail: '',
    },
    tags: ['Медтех', 'iOS + Android'],
    shot: '/figma/docmed-cover.webp',
    shotKind: 'cover',
    story: {
      summary:
        'Клиники доказательной медицины: личный кабинет пациента — запись к врачу, результаты обследований, телемедицина',
      metrics: [
        { value: 'iOS + Android', label: 'нативные приложения' },
        { value: 'две клиники', label: 'взрослая и детская' },
        { value: 'телемедицина', label: 'прием онлайн' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'Docmed и Docdeti работают по принципам доказательной медицины: взрослая и детская клиники с общей картотекой пациентов. Запись, результаты и связь с врачом были разнесены по разным каналам',
        },
        {
          title: 'Что сделали',
          body: 'Собрали приложения под iOS и Android: запись к врачу с выбором специалиста, результаты обследований в личном кабинете, онлайн-консультация без визита в клинику',
        },
        {
          title: 'Результат',
          body: 'Пациент ведет лечение в одном приложении: записывается, забирает результаты и выходит на связь с врачом онлайн',
        },
      ],
    },
  },
  {
    id: 'alfastrah',
    client: 'АльфаСтрахование',
    category: 'страхование',
    tabs: ['Для банков'],
    desc: {
      lead: 'Приложение для клиентов страховой —',
      highlight: '800 000+ пользователей в месяц',
      tail: '',
    },
    tags: ['Страхование', 'Android + PWA'],
    shot: '/figma/alfastrah-cover.webp',
    shotKind: 'cover',
    story: {
      summary:
        'Приложение для клиентов страховой компании: управление полисами, заявление убытков, поддержка и программа лояльности',
      metrics: [
        { value: '800 000+', label: 'пользователей в месяц' },
        { value: 'Android + PWA', label: 'платформы' },
        { value: 'Backend Driven UI', label: 'релизы без обновления' },
      ],
      sections: [
        {
          title: 'Контекст',
          body: 'У клиентов страховой полисы, убытки и обращения в поддержку жили в разных каналах — приложению нужна была продуктовая команда и темп выпуска функций',
        },
        {
          title: 'Что сделали',
          body: 'Построили продуктовую команду мобильного приложения и внедрили Backend Driven UI: интерфейс нативных приложений собирается на сервере, поэтому новые функции выходят без релиза в сторах',
        },
        {
          title: 'Результат',
          body: 'Приложением пользуются больше 800 000 человек в месяц: полисы, заявление убытков, поддержка и программа лояльности в одном интерфейсе',
        },
      ],
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
};

export const productsIntro = deepNbsp({
  titleLead: 'Создаем собственные ИТ-продукты,',
  titleMuted: 'которыми пользуемся в работе',
} as const);

export const products: Product[] = deepNbsp<Product[]>([
  {
    id: 'doki',
    name: 'doki',
    tagline: 'Система управления доками',
    heading: '«doki» — платформа управления документацией',
    body: 'Must-have для систематизации и устранения хаоса в документах',
  },
  {
    id: 'hub',
    name: 'MonteHub',
    tagline: 'Самописный склад',
    heading: '«MonteHub» — система складского учета',
    body: 'Закрывает приемку, остатки и логистику в одном окне — без таблиц',
  },
  {
    id: 'standby',
    name: 'Standby',
    tagline: 'Доска фокуса',
    heading: '«Standby» — доска, которая держит фокус',
    body: 'Задачи, таймеры и прогресс на одной доске, обновляются в реальном времени',
  },
]);

// ─── Blog ──────────────────────────────────────────────────────────
type BlogBlock =
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
  cover?: string; // full-bleed image at the top of the lead card
  inset?: string; // product shot that sits inside a card instead of filling it
};

export const blogIntro = deepNbsp({
  title: 'Наш блог',
  body: 'Делимся новостями и экспертизой в разработке. Рассказываем про нас и наш процесс, публикуем кейсы и новости, показываем жизнь студии в «прямом эфире»',
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
    // the game itself — the same shot the Добрый case card carries
    cover: '/figma/dobry-cover.webp',
    excerpt: 'Промо-веб-игра для бренда №1 на рынке соков — от идеи до прода за четыре недели',
    body: [
      {
        type: 'p',
        text: 'Бренду нужна была легкая механика к рекламной кампании: игра прямо в браузере, без установки. Зашел — и сразу играешь',
      },
      { type: 'h', text: 'Почему так быстро' },
      {
        type: 'p',
        text: 'Мы собрали прототип на вайбкоде за пару дней и сразу показали заказчику. Когда механика согласована, остальное — дело техники: продакшн, нагрузочные тесты, релиз',
      },
      { type: 'quote', text: 'Главное в промо — успеть к запуску кампании. Мы успели с запасом' },
      {
        type: 'p',
        text: 'Игра выдержала промо-трафик и вышла в срок — для бренда №1 на рынке соков России',
      },
      { type: 'h', text: 'Что было под капотом' },
      {
        type: 'p',
        text: 'Легкий веб-стек без тяжелых зависимостей: игра открывается мгновенно и держит пиковую нагрузку кампании. Отдельно вылизали мобильные браузеры — основной трафик промо приходит с телефонов',
      },
      {
        type: 'quote',
        text: 'Быстро — не значит на коленке. Быстро — значит без лишних согласований',
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
    excerpt: 'Рассказываем, как устроен наш процесс — без обещаний, на фактах',
    body: [
      {
        type: 'p',
        text: 'Часто «разработка под ключ» звучит как утопия: сроки плывут, бюджет растет, результат не тот. У нас иначе — и вот почему',
      },
      { type: 'h', text: 'Фикс-прайс и сроки в договоре' },
      {
        type: 'p',
        text: 'Мы фиксируем состав работ и стоимость до старта. Свой штат, без подряда — значит, отвечаем за каждый этап сами',
      },
      {
        type: 'p',
        text: 'Тех-лид участвует во всех проектах и сам пишет код. Связь напрямую, без прослойки из аккаунт-менеджеров',
      },
      { type: 'h', text: 'Как мы оцениваем' },
      {
        type: 'p',
        text: 'Перед стартом разбираем задачу на этапы и считаем каждый. Прозрачная смета без «звездочек», а если что-то меняется по ходу — фиксируем изменение отдельно, а не задним числом',
      },
      {
        type: 'p',
        text: 'Демо на каждом этапе: вы видите прогресс не на словах, а в работающем продукте',
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
    inset: '/figma/monte-gtr.png',
    excerpt: 'Собрали диджитал-устройство для дрифт-комьюнити — железо и софт в одной связке',
    body: [
      {
        type: 'p',
        text: 'Иногда задачи выходят за рамки экрана. Здесь нужно было устройство, которое живет в машине и общается с приложением',
      },
      { type: 'h', text: 'Железо плюс софт' },
      {
        type: 'p',
        text: 'Мы не только написали приложение, но и продумали связку с физическим устройством — телеметрия, отклик, синхронизация в реальном времени',
      },
      { type: 'p', text: 'Получился цельный продукт для дрифт-комьюнити' },
      { type: 'h', text: 'Железо — это сложно' },
      {
        type: 'p',
        text: 'С железом нет права на «потом поправим обновлением»: прошивку и протокол обмена с приложением проектировали так, чтобы устройство работало автономно и переживало апдейты по воздуху',
      },
      {
        type: 'quote',
        text: 'Самое интересное начинается там, где экран заканчивается',
      },
    ],
  },
]);

// ─── Footer (contacts) ─────────────────────────────────────────────
// The request form is now the inline letter composer (<LetterBody>), so the old
// form/socials copy was removed — only the heading, manager and contacts remain.
export const footer = deepNbsp({
  formTitle: ['Отправьте', 'нам', 'письмо'],
  manager: { name: 'Анна Кузнецова', role: 'вам ответит наш менеджер' },
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
export const servicesIntro = deepNbsp({
  titleLead: 'Делаем сайты, приложения и сервисы',
  titleAccent: 'под ключ',
  body: 'Не знаете, как назвать задачу, — поможем сформулировать и подберем состав работ. Ниже — направления, с которыми работаем',
} as const);

// ─── Thank-you letters ─────────────────────────────────────────────
// PARKED, not rendered: Gosha asked to hide the section (task #16) but keep the
// content — it returns once Vadim supplies the real letters. Delete only on his
// word; until then knip will list these two as unused exports.
export const lettersIntro = deepNbsp({
  title: 'Благодарственные письма',
  body: 'Официальные отзывы и рекомендательные письма от компаний, с которыми мы работали',
} as const);

export type Letter = { id: string; tag: string; title: string; text: string };

export const letters: Letter[] = deepNbsp<Letter[]>([
  {
    id: 'l1',
    tag: 'Отзыв',
    title: 'Довели сервис хранения до прода в срок',
    text: 'Команда tachos собрала Складно с нуля — рекомендуем как надежного подрядчика',
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
    text: 'Спасибо за вовлеченность и качество на каждом этапе работы. — Maginary',
  },
]);
