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
    { label: 'Услуги', href: '#services' },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'Блог Tachos', href: '#blog' },
    { label: 'Контакты', href: '#contacts' },
  ],
  cta: 'Связаться',
};

export const hero = deepNbsp({
  title: ['Технологический партнер бизнеса'],
  // Two-part sub-head: `lead` is the claim, `rest` spells out the scope.
  subhead: {
    lead: 'Создаем сложные IT-продукты',
    rest: 'Берем на себя все — от пользовательского приложения до серверной логики, интеграций и внутренних систем',
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
  inputPlaceholder: 'Опишите задачу — мы поможем ее решить',
  needLabel: 'Мне нужно:',
  chips: [
    'Сайт',
    'Мобильное приложение',
    'CRM',
    'Настроить интеграцию',
    'Геймификационная механика',
    'Backend и API',
    'Другое',
  ],
} as const);

export type Client = { name: string; logo: string; height: number };

// Logo wall. Heights mirror the Figma row. Set is placeholder — verify with Vadim.
// Heights tuned to a shared optical baseline so the row reads as one weight.
export const clients: Client[] = [
  { name: 'Admitad', logo: '/logos/admitad.svg', height: 26 },
  { name: 'Лукойл', logo: '/logos/lukoil.png', height: 20 },
  { name: 'Monte', logo: '/logos/monte.svg', height: 19 },
  { name: 'Добрый', logo: '/logos/dobry-color.svg', height: 24 },
  { name: 'Складно', logo: '/logos/skladno.svg', height: 36 },
  { name: 'Хайс', logo: '/logos/hais-mono.svg', height: 25 },
  { name: 'Модульбанк', logo: '/logos/modulbank.svg', height: 28 },
  // Two-line lockup, so it carries a taller box than the wordmark-only logos.
  { name: 'АльфаСтрахование', logo: '/logos/alfastrah.png', height: 26 },
  { name: 'Maginary', logo: '/logos/maginary-grunge.svg', height: 40 },
  { name: 'StarHub', logo: '/logos/starhub.png', height: 34 },
  { name: 'Ooredoo', logo: '/logos/ooredoo.png', height: 22 },
  { name: 'Idea', logo: '/logos/idea.png', height: 22 },
  // Official lockup is stacked; laid out side-by-side so it fits the single row.
  { name: 'Unilever', logo: '/logos/unilever.png', height: 26 },
];

// Label above the hero logo grid (bottom-right, filter.im-style composition).
export const trustLabel = 'Нам доверяют';

export const founder = deepNbsp({
  heading: ['Для экстренных вопросов', 'вы можете связаться', 'с основателем студии'],
  facts: ['Тех лид во всех проектах — сам пишу код', 'На связи напрямую, без аккаунт-менеджеров'],
  contactCta: 'Написать Вадиму',
  // The CTA goes straight to his Telegram, not to the studio letter.
  contactHref: 'https://t.me/vvadik',
  presentation: { label: 'Презентация Вадима', duration: '0:34' },
  person: { name: 'Вадим Витехновский', role: 'Основатель, тех-лид' },
} as const);

export const casesIntro = deepNbsp({
  titleBlack: 'Успешно запустили',
  // The counter animates up to `count`, so the «+» rides in the suffix.
  titleAccent: { prefix: '', count: 100, suffix: '+ цифровых продуктов c 2012 года' },
  subtitle: 'Свой штат и тех-лид в каждом проекте — без подряда',
} as const);

export type CaseTab = { label: string; count?: number; icon?: 'star'; active?: boolean };

// Counts are derived from the cases at render time (CasesExplorer), not hardcoded.
export const caseTabs: CaseTab[] = [
  { label: 'Все', active: true },
  { label: 'Финтех' },
  { label: 'E-commerce' },
  { label: 'Геймдев' },
  { label: 'IoT' },
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
  tags: string[];
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
  title: 'Что говорят клиенты',
  subtitle:
    'Погружаемся в продукт, предлагаем новые решения и сохраняем экспертизу внутри команды — многие проекты развиваем вместе с клиентами годами',
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
    tabs: ['Финтех'],
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
    id: 'alfastrah',
    client: 'АльфаСтрахование',
    category: 'страхование',
    tabs: ['Финтех'],
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
  {
    id: 'maginary',
    client: 'Maginary',
    category: 'приложение-книга',
    tabs: ['Геймдев'],
    desc: {
      lead: 'Иммерсивная книга-игра, где читатель становится героем —',
      highlight: '3 млн+ установок',
      tail: 'и Game of the Day в App Store',
    },
    tags: ['Game of the Day в App Store', 'iOS'],
    shot: '/figma/maginary-cover.webp',
    coverVideo: '/covers/maginary-cover.mp4',
    shotKind: 'cover',
    coverDark: true,
    story: {
      summary: 'Иммерсивная книга-игра, где читатель становится героем истории',
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
    tabs: ['E-commerce'],
    desc: {
      lead: 'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — все в приложении',
      highlight: '95+ точек, 8 000 пользователей',
      tail: '',
    },
    tags: ['IoT', 'iOS + Android'],
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
    id: 'dobry',
    client: 'Добрый',
    category: 'FMCG',
    tabs: ['Геймдев'],
    desc: {
      lead: '',
      highlight: 'Игра за месяц: от идеи до прода',
      tail: 'для бренда №1 на рынке соков России',
    },
    tags: ['Геймификация', 'Web', 'Backend и API'],
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
    id: 'imast',
    client: 'IMAST',
    category: 'благотворительность',
    tabs: ['E-commerce'],
    desc: {
      lead: 'Сервис микродонатов — помощь людям через фонды Армении',
      tail: '',
    },
    tags: ['Web', 'Backend и API', 'iOS + Android'],
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
    id: 'monte',
    client: 'Monte',
    category: 'автотюнинг',
    tabs: ['IoT'],
    desc: { lead: 'Сайт и сервисы для студии автотюнинга', tail: '' },
    tags: ['IoT', 'Web', 'iOS + Android', 'Backend и API'],
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
  titleLead: 'Создаем собственные инструменты',
  titleMuted: 'и IT-продукты',
  body: 'Находим рабочие решения для собственных задач, обкатываем их внутри команды и развиваем в самостоятельные продукты для других',
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
    body: 'Объединяет приемку, остатки и логистику в одном интерфейсе — без ручных таблиц',
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
  title: 'Блог Tachos',
  body: 'Делимся техническими находками, решениями из реальных проектов и опытом запуска собственных сервисов. А иногда просто рассказываем новости компании или отрасли',
  readCta: 'Читать',
} as const);

export const posts: Post[] = deepNbsp<Post[]>([
  {
    id: 'p1',
    slug: 'igra-dlya-dobrogo',
    title: 'За месяц выпустили игру для «Доброго»',
    tag: 'Кейс',
    date: '16 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    // the game itself — the same shot the Добрый case card carries
    cover: '/figma/dobry-cover.webp',
    excerpt:
      'Как спроектировали механику, собрали продукт и подготовили его к запуску в ограниченный срок',
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
  formTitle: ['Расскажите', 'нам', 'о задаче'],
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
  titleLead: 'Мобильная и веб-разработка',
  titleAccent: 'под ключ',
  body: 'Создаем продукты с нуля, дорабатываем сложные системы и развиваем сервисы после запуска',
  note: 'Техлид и собственный штат в каждом проекте',
} as const);

export type Service = { title: string; body: string };

// Six directions from the copy doc — they replaced the role cards that used to
// stand in for services here (the roles moved to their own block, see teamRoles).
export const services: Service[] = deepNbsp<Service[]>([
  {
    title: 'Мобильные приложения для iOS и Android',
    body: 'От архитектуры и продуктовой логики до аналитики и стабильной работы',
  },
  {
    title: 'Веб-приложения',
    body: 'Создаем личные кабинеты, сервисы и интерфейсы со сложной бизнес-логикой',
  },
  {
    title: 'Backend и API',
    body: 'Проектируем серверную часть, работу с данными и архитектуру, которую можно развивать и масштабировать',
  },
  {
    title: 'Админ-панели и внутренние системы',
    body: 'Создаем инструменты для управления пользователями, контентом, операциями и данными продукта',
  },
  {
    title: 'Интеграции',
    body: 'Связываем продукт с CRM, платежными сервисами, партнерскими системами и внешними API',
  },
  {
    title: 'IoT и Bluetooth',
    body: 'Разрабатываем мобильную часть продуктов, которые взаимодействуют с устройствами и выходят за пределы экрана',
  },
]);

// ─── Team composition ──────────────────────────────────────────────
// Roles available under the T&M model. NO rates and NO grades (Middle/Senior)
// by design — Гоша asked to drop ₽/час and grades, just "we have these specs".
// The copy doc keeps this block but wants it away from the services offer, so it
// now stands on its own below the products.
export const teamIntro = deepNbsp({
  title: 'Состав команды',
  body: 'Собираем команду под задачу из своих людей — без подряда на стороне',
} as const);

export const teamRoles: readonly string[] = [
  'Продуктовый UX/UI дизайнер',
  'Арт-директор',
  'Дизайн-директор',
  'Frontend-разработчик',
  'Backend-разработчик',
  'Системный аналитик',
  'Продуктовый аналитик',
  'QA-специалист',
  'DevOps-инженер',
];

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

// ─── «О компании» page ─────────────────────────────────────────────
// Full text comes from the copy doc; nothing here is invented.
export const about = deepNbsp({
  hero: {
    title: 'Мы любим сложные проекты с понятной ценностью для мира',
    body: 'Tachos (читается как «тачос», да, не «такос») появился в 2012 году. С тех пор технологии несколько раз успели поменяться, а наш подход — нет: нам важно разобраться, как все устроено изнутри, докопаться до сути задачи и сделать так, чтобы продукт не просто работал, а работал хорошо. Выдерживал любую нагрузку, добавление новых функций и годы развития.',
  },
  sections: [
    {
      title: 'Да, мы задаем много вопросов',
      paragraphs: [
        'Иногда клиент приходит с формулировкой «сделайте нормально». Но «нормально» у всех разное, поэтому мы разбираемся, кто будет пользоваться продуктом, что должно происходить внутри системы, какие данные нужны бизнесу и что будет с продуктом через год.',
        'Со стороны это может выглядеть как излишняя дотошность. Но если мы видим, что задачу можно решить проще, надежнее или выгоднее, то мы предлагаем свой вариант, даже если его не было в первоначальном запросе.',
      ],
    },
    {
      title: 'Не тащим в прод все, что появилось только вчера',
      paragraphs: [
        'Мы любим новые технологии, но еще больше любим работающие продукты.',
        'Поэтому используем современные инструменты, которые уже доказали надежность. Эксперименты оставляем для собственных проектов и прототипов, а в клиентский продукт забираем то, что можно поддерживать, масштабировать и не переписывать через полгода.',
        'При этом нам интересны задачи, где нужно выйти за пределы стандартного приложения: связать мобильный продукт с Bluetooth-устройством, придумать архитектуру для гибкого интерфейса, разобраться с финтехом, данными, кошельками или сложной внутренней логикой.',
      ],
    },
    {
      title: 'Хорошая разработка — это когда о проблеме знаем только мы, а не пользователь',
      paragraphs: [
        'Для нас аналитика, метрики и мониторинг — не дополнение, которое подключают после релиза. Это часть самого продукта. В одном из банковских проектов мы выстроили логирование так, что наша команда находила сбой раньше, чем клиент успевал его заметить и написать в поддержку. Но даже если он доходил до нее, то к моменту обращения проблема уже была исправлена.',
      ],
    },
  ],
  letter: {
    lead: 'Мне нравится разбираться в сложных продуктах — понимать, как устроен бизнес, что важно пользователям и где технологии действительно могут сделать жизнь людей лучше',
    paragraphs: [
      'Особенно интересно работать над проектами, в которых есть пространство для инженерной мысли: можно глубоко погрузиться в задачу, предложить несколько вариантов решения и вместе выбрать тот, который будет удобно развивать.',
      'Для меня хороший проект строится на диалоге. Команда делится технической экспертизой, клиент — знанием своего бизнеса, и из этого получается крутой продукт.',
      'Больше всего я ценю долгую работу, когда после запуска мы продолжаем развивать систему, лучше понимаем ее пользователей и со временем становимся полноценной частью продуктовой команды.',
    ],
    sign: 'Вадим Витехновский, основатель Tachos',
  },
  team: {
    title: 'Здесь нет случайных людей',
    paragraphs: [
      'Большая часть команды работает вместе уже много лет. Кто-то пришел почти в самом начале, кто-то присоединился позже, но вместе с опытом, знанием проектов и привычкой отвечать за то, что сделали.',
      'Мы крайне редко передаем разработку подрядчикам. Продукт делают люди, с которыми клиент общается на встречах и которые потом остаются отвечать за решения и результат.',
      'Наверное, нас действительно можно назвать гиками. Мы можем долго обсуждать архитектуру, спорить о деталях и собирать внутренний инструмент просто потому, что существующий работает неудобно. Иногда из таких инструментов вырастают отдельные продукты.',
      'Нам нравится не только пользоваться технологиями, но и разбираться, как они устроены и что с их помощью можно сделать лучше.',
    ],
  },
  figures: [
    { value: 'С 2012 года', label: 'работаем над цифровыми продуктами' },
    { value: '100+ продуктов', label: 'запустили и развивали' },
    { value: 'Более 5 лет', label: 'работаем с отдельными клиентами' },
  ],
  cta: {
    title: 'Есть задача, в которой пока больше вопросов, чем ответов?',
    body: 'Это нормально. Расскажите, что хотите сделать или что не работает. Мы разберемся в контексте и предложим, с чего начать.',
    button: 'Обсудить задачу',
  },
} as const);

// One sentence about the company, used verbatim on the site, in catalogues and
// in press profiles (copy doc, «Единое описание компании»).
export const companyDescription =
  'Tachos — технологический партнер по созданию и развитию сложных цифровых продуктов для бизнеса.';

export const companyDescriptionLong =
  'Tachos создает и развивает сложные цифровые продукты для бизнеса, беря на себя весь технический контур: мобильные и веб-приложения, backend, внутренние системы и интеграции.';
