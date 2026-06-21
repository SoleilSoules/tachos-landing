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
  { name: 'Maginary', logo: '/logos/maginary-grunge.svg', height: 30 },
];

export const founder = deepNbsp({
  heading: ['Для экстренных вопросов', 'вы можете связаться', 'с основателем студии'],
  facts: [
    'Тех лид во всех проектах — сам пишу код',
    'На связи напрямую, без аккаунт-менеджеров',
  ],
  contactCta: 'Написать Вадиму',
  presentation: { label: 'Презентация Вадима', duration: '0:34' },
  person: { name: 'Вадим Вадимов', role: 'Head of product' },
} as const);

export const casesIntro = deepNbsp({
  titleBlack: 'Успешно запустили',
  titleAccent: { prefix: 'более ', count: 40, suffix: ' цифровых продуктов' },
  body: [
    'Мы мыслим как владельцы бизнеса — цифрами и метриками.',
    'Превращаем смелые гипотезы в прибыльные цифровые продукты.',
    'Ниже — истории, где это уже сработало',
  ],
} as const);

export type CaseTab = { label: string; count?: number; icon?: 'star'; active?: boolean };

export const caseTabs: CaseTab[] = [
  { label: 'Все', active: true },
  { label: 'Для банков', count: 12 },
  { label: 'eCommerce', count: 12 },
  { label: 'Для маркетплейсов', count: 12 },
  { label: 'Геймдев', count: 12 },
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

export const cases: CaseItem[] = deepNbsp<CaseItem[]>([
  {
    id: 'skladno',
    client: 'Складно',
    category: 'сервис хранения',
    desc: {
      lead: 'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — всё в приложении.',
      highlight: '95+ точек, 8 000 пользователей',
      tail: '',
    },
    tags: ['Сервис хранения', 'Mobile + бэкенд'],
    cover,
    avatar,
    story: {
      summary: 'Сеть хранения без персонала: бронь, оплата и доступ к ячейке по Bluetooth — всё в приложении.',
      metrics: [
        { value: '95+', label: 'точек сети' },
        { value: '8 000', label: 'активных пользователей' },
        { value: 'Bluetooth', label: 'доступ к ячейке' },
      ],
      sections: [
        { title: 'Контекст', body: 'Клиент запускал сеть автоматизированных складов хранения без сотрудников на точках. Нужно было приложение, которое закрывает весь путь: найти точку, забронировать ячейку, оплатить и открыть дверь — без участия персонала.' },
        { title: 'Что сделали', body: 'Собрали мобильное приложение под iOS и Android и бэкенд к нему: карта точек, бронирование и оплата, открытие ячейки по Bluetooth, статусы аренды и push-уведомления.' },
        { title: 'Результат', body: 'Сеть выросла до 95+ точек и 8 000 пользователей. Доступ по Bluetooth убрал необходимость держать сотрудников на точках.' },
      ],
    },
    verified: true,
  },
  {
    id: 'hais',
    client: 'Хайс',
    category: 'финтех',
    desc: {
      lead: 'Мобильный банк для ИП с нуля —',
      highlight: 'счёт, бухгалтерия и валюта',
      tail: 'в одном приложении',
    },
    tags: ['Финтех', 'iOS + Android'],
    cover,
    avatar,
    story: {
      summary: 'Мобильный банк для ИП с нуля — счёт, бухгалтерия и валюта в одном приложении.',
      metrics: [
        { value: 'с нуля', label: 'банк под ключ' },
        { value: 'iOS + Android', label: 'нативные приложения' },
        { value: 'анти-фрод', label: 'доработка SDK' },
      ],
      sections: [
        { title: 'Контекст', body: 'Финтех-команда строила мобильный банк для индивидуальных предпринимателей: счёт, бухгалтерия и мультивалютность в одном приложении.' },
        { title: 'Что сделали', body: 'Спроектировали и собрали нативные приложения под iOS и Android, доработали SDK для анти-фрод сервиса банковских организаций, подготовили инфраструктуру под нагрузку.' },
        { title: 'Результат', body: 'Запустили мобильный банк для ИП — счёт, бухгалтерия и валюта в едином интерфейсе, с защитой от мошенничества на уровне SDK.' },
      ],
    },
    verified: true,
  },
  {
    id: 'maginary',
    client: 'Maginary',
    category: 'приложение-книга',
    desc: {
      lead: 'Анимированная книга-игра, где читатель становится героем.',
      highlight: '750 000 загрузок',
      tail: 'в App Store',
    },
    tags: ['Приложение-книга', 'iOS'],
    cover,
    avatar,
    story: {
      summary: 'Анимированная книга-игра, где читатель становится героем истории.',
      metrics: [
        { value: '750 000', label: 'загрузок в App Store' },
        { value: 'iOS', label: 'нативное приложение' },
        { value: 'книга-игра', label: 'формат продукта' },
      ],
      sections: [
        { title: 'Контекст', body: 'Студия делала интерактивную книгу-игру: вместо линейного чтения пользователь принимает решения и влияет на сюжет, а сцены оживают анимацией.' },
        { title: 'Что сделали', body: 'Собрали нативное iOS-приложение с анимированными сценами, ветвлением сюжета и плавными переходами между главами.' },
        { title: 'Результат', body: 'Приложение набрало 750 000 загрузок в App Store.' },
      ],
    },
    verified: true,
  },
  {
    id: 'dobry',
    client: 'Добрый',
    category: 'FMCG',
    desc: {
      lead: '',
      highlight: 'Игра за месяц: от идеи до прода',
      tail: 'для бренда №1 на рынке соков России',
    },
    tags: ['Web-игра', '4 недели'],
    cover,
    avatar,
    story: {
      summary: 'Промо-игра для бренда №1 на рынке соков России — от идеи до прода за месяц.',
      metrics: [
        { value: '4 недели', label: 'от идеи до релиза' },
        { value: 'Web-игра', label: 'формат' },
        { value: '№1', label: 'бренд соков в РФ' },
      ],
      sections: [
        { title: 'Контекст', body: 'Бренду нужна была промо-механика к кампании: лёгкая веб-игра, в которую можно играть прямо из браузера, без установки.' },
        { title: 'Что сделали', body: 'За четыре недели прошли весь путь — идея, прототип, продакшн и релиз веб-игры, готовой к промо-трафику.' },
        { title: 'Результат', body: 'Игра вышла в срок к запуску кампании бренда №1 на рынке соков России.' },
      ],
    },
  },
  // ⚠️ placeholder cases (NOT real Tachos work) — заполняют второй ряд под кнопкой
  // «Показать ещё». Vadim: заменить на реальные кейсы или удалить (и вернуть грид к 4).
  {
    id: 'potok',
    client: 'Поток',
    category: 'логистика',
    desc: {
      lead: 'Платформа курьерской доставки: маршруты, трекинг и расчёты для операторов.',
      highlight: '12 городов, 400 курьеров',
      tail: '',
    },
    tags: ['Логистика', 'Web + mobile'],
    cover,
    avatar,
    story: {
      summary: 'Платформа курьерской доставки: маршруты, трекинг и расчёты для операторов.',
      metrics: [
        { value: '12', label: 'городов' },
        { value: '400', label: 'курьеров на платформе' },
        { value: 'Web + mobile', label: 'связка продуктов' },
      ],
      sections: [
        { title: 'Контекст', body: 'Оператору доставки нужна была единая платформа для построения маршрутов, отслеживания курьеров и расчётов.' },
        { title: 'Что сделали', body: 'Собрали веб-панель для операторов и мобильное приложение для курьеров: маршруты, трекинг в реальном времени, расчёты.' },
        { title: 'Результат', body: 'Платформа работает в 12 городах с 400 курьерами.' },
      ],
    },
  },
  {
    id: 'grace',
    client: 'Грейс',
    category: 'здоровье',
    desc: {
      lead: 'Запись к врачу и телемедицина в одном приложении —',
      highlight: '60 000 приёмов',
      tail: 'в месяц',
    },
    tags: ['Здоровье', 'iOS + Android'],
    cover,
    avatar,
    story: {
      summary: 'Запись к врачу и телемедицина в одном приложении.',
      metrics: [
        { value: '60 000', label: 'приёмов в месяц' },
        { value: 'iOS + Android', label: 'нативные приложения' },
        { value: 'телемед', label: 'видеоприёмы' },
      ],
      sections: [
        { title: 'Контекст', body: 'Сервису здоровья нужно было объединить запись к врачу и онлайн-консультации в одном приложении.' },
        { title: 'Что сделали', body: 'Собрали нативные приложения под iOS и Android: запись к специалисту, видеоприёмы, история обращений.' },
        { title: 'Результат', body: 'Через сервис проходит 60 000 приёмов в месяц.' },
      ],
    },
  },
  // ⚠️ placeholder-кейсы (NOT real Tachos work) — нужны, чтобы «Показать ещё»
  // работал по 2 несколько раз. Vadim: заменить на реальные или удалить.
  {
    id: 'vektor',
    client: 'Вектор',
    category: 'аналитика',
    desc: {
      lead: 'BI-панель для отдела продаж: дашборды, отчёты и прогнозы в реальном времени.',
      highlight: '40+ дашбордов',
      tail: '',
    },
    tags: ['Аналитика', 'Web'],
    cover,
    avatar,
    story: {
      summary: 'BI-панель для отдела продаж: дашборды, отчёты и прогнозы в реальном времени.',
      metrics: [
        { value: '40+', label: 'дашбордов' },
        { value: 'real-time', label: 'обновление' },
        { value: 'Web', label: 'платформа' },
      ],
      sections: [
        { title: 'Контекст', body: 'Отделу продаж не хватало единой картины: данные жили в разных таблицах и выгрузках.' },
        { title: 'Что сделали', body: 'Собрали BI-панель с дашбордами, автоматическими отчётами и прогнозами на основе исторических данных.' },
        { title: 'Результат', body: '40+ дашбордов закрыли потребности команды — решения принимаются по цифрам.' },
      ],
    },
  },
  {
    id: 'orbita',
    client: 'Орбита',
    category: 'образование',
    desc: {
      lead: 'Платформа онлайн-курсов: уроки, тесты и прогресс ученика в одном кабинете.',
      highlight: '20 000 учеников',
      tail: '',
    },
    tags: ['EdTech', 'Web + mobile'],
    cover,
    avatar,
    story: {
      summary: 'Платформа онлайн-курсов: уроки, тесты и прогресс ученика в одном кабинете.',
      metrics: [
        { value: '20 000', label: 'учеников' },
        { value: 'Web + mobile', label: 'связка' },
        { value: 'EdTech', label: 'направление' },
      ],
      sections: [
        { title: 'Контекст', body: 'Образовательному проекту нужна была платформа с уроками, тестами и трекингом прогресса.' },
        { title: 'Что сделали', body: 'Собрали веб-кабинет и мобильное приложение: видеоуроки, тесты, прогресс и сертификаты.' },
        { title: 'Результат', body: 'На платформе учатся 20 000 человек.' },
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
  body: 'Делимся новостями и экспертизой в разработке. Рассказываем про нас и наш процесс, публикуем кейсы, новости и хвастаемся достижениями, показываем жизнь студии в «прямом эфире».',
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
      { type: 'p', text: 'Бренду нужна была лёгкая механика к рекламной кампании: игра прямо в браузере, без установки. Зашёл — и сразу играешь.' },
      { type: 'h', text: 'Почему так быстро' },
      { type: 'p', text: 'Мы собрали прототип на вайбкоде за пару дней и сразу показали заказчику. Когда механика согласована, остальное — дело техники: продакшн, нагрузочные тесты, релиз.' },
      { type: 'quote', text: 'Главное в промо — успеть к запуску кампании. Мы успели с запасом.' },
      { type: 'p', text: 'Игра выдержала промо-трафик и вышла в срок — для бренда №1 на рынке соков России.' },
    ],
  },
  {
    id: 'p2',
    slug: 'razrabotka-ne-utopia',
    title: 'Наша разработка — это не утопия',
    tag: 'Кейс',
    date: '20 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    excerpt: 'Рассказываем, как устроен наш процесс — без обещаний, на фактах.',
    body: [
      { type: 'p', text: 'Часто «разработка под ключ» звучит как утопия: сроки плывут, бюджет растёт, результат не тот. У нас иначе — и вот почему.' },
      { type: 'h', text: 'Фикс-прайс и сроки в договоре' },
      { type: 'p', text: 'Мы фиксируем состав работ и стоимость до старта. Свой штат, без подряда — значит, отвечаем за каждый этап сами.' },
      { type: 'p', text: 'Тех-лид участвует во всех проектах и сам пишет код. Связь напрямую, без прослойки из аккаунт-менеджеров.' },
    ],
  },
  {
    id: 'p3',
    slug: 'ustroistvo-dlya-drifta',
    title: 'Сделали устройство для дрифта дикого',
    tag: 'Новость',
    date: '16 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    withImage: true,
    excerpt: 'Собрали диджитал-устройство для дрифт-комьюнити — железо и софт в одной связке.',
    body: [
      { type: 'p', text: 'Иногда задачи выходят за рамки экрана. Здесь нужно было устройство, которое живёт в машине и общается с приложением.' },
      { type: 'h', text: 'Железо плюс софт' },
      { type: 'p', text: 'Мы не только написали приложение, но и продумали связку с физическим устройством — телеметрия, отклик, синхронизация в реальном времени.' },
      { type: 'p', text: 'Получился цельный продукт для дрифт-комьюнити.' },
    ],
  },
]);

// ─── Footer (contacts) ─────────────────────────────────────────────
// The request form is now the inline letter composer (<LetterBody>), so the old
// form/socials copy was removed — only the heading, manager and contacts remain.
export const footer = deepNbsp({
  formTitle: ['Отправьте', 'нам', 'письмо'],
  manager: { name: 'Анна Кузнецова', role: 'Ваш менеджер проекта' },
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
  body: 'Не знаете, как назвать задачу, — поможем сформулировать и подберём состав работ. Ниже — направления, в которых мы сильны, и ориентиры по бюджету.',
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
  { name: 'Web Design', desc: 'Лендинги, корпоративные сайты, веб-сервисы под ключ', price: 'от 400 000 ₽' },
  { name: 'Mobile Development', desc: 'iOS и Android — нативно и кроссплатформенно', price: 'от 1 200 000 ₽' },
  { name: 'Backend & Infrastructure', desc: 'API, базы данных, очереди, self-hosted и облако', price: 'от 800 000 ₽' },
  { name: 'Discovery & Analytics', desc: 'Исследование, прототип, метрики и аналитика продукта', price: 'от 300 000 ₽' },
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
