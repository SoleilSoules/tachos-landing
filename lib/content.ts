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
    { label: 'О нас', href: '#about' },
    { label: 'Медиа', href: '#media' },
  ],
  cta: 'Связаться',
};

export const hero = deepNbsp({
  title: ['Стоим за сильными', 'продуктами и брендами'],
  subhead: {
    lead: 'Студия инжиниринга и дизайна.',
    rest: 'Проектируем и собираем веб- и мобильные продукты для фаундеров и компаний — от идеи до релиза в проде',
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

export type CaseItem = {
  id: string;
  client: string;
  category: string;
  desc: { lead: string; highlight: string; tail: string };
  tags: [string, string];
  cover: string;
  avatar: string;
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
  subtitle: 'С этими крутышами мы работаем уже больше 2 лет',
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
    name: 'hub',
    tagline: 'Самописный склад',
    heading: '«hub» — система складского учёта',
    body: 'Закрывает приёмку, остатки и логистику в одном окне — без таблиц',
    cta: 'Узнать про hub',
  },
  {
    id: 'balibali',
    name: 'balibali',
    tagline: 'Конструктор ресторанов',
    heading: '«balibali» — конструктор ресторанов',
    body: 'Меню, заказы и QR-обслуживание — всё для заведения из коробки',
    cta: 'Узнать про balibali',
  },
]);

// ─── Blog ──────────────────────────────────────────────────────────
export type Post = {
  id: string;
  title: string;
  tag: 'Новость' | 'Кейс';
  date: string;
  read: string;
  author: string;
  authorRole: string;
  withImage?: boolean; // the wide right-hand card carries a cover
};

export const blogIntro = deepNbsp({
  title: 'Наш блог',
  body: 'Делимся новостями и экспертизой в разработке. Рассказываем про нас и наш процесс, публикуем кейсы, новости и хвастаемся достижениями, показываем жизнь студии в «прямом эфире».',
} as const);

export const posts: Post[] = deepNbsp<Post[]>([
  {
    id: 'p1',
    title: 'За месяц выпустили игру для Доброго',
    tag: 'Новость',
    date: '16 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
  },
  {
    id: 'p2',
    title: 'Наша разработка — это не утопия',
    tag: 'Кейс',
    date: '20 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
  },
  {
    id: 'p3',
    title: 'Сделали устройство для дрифта дикого',
    tag: 'Новость',
    date: '16 июня',
    read: '3 минуты',
    author: 'Вадим',
    authorRole: 'Тех лид',
    withImage: true,
  },
]);

// ─── Footer (request form + contacts + socials) ────────────────────
export type Social = {
  id: string;
  brand: string;
  label: string;
  kind: 'tg' | 'vk' | 'yt' | 'link';
};

export const footer = deepNbsp({
  formTitle: ['Сделаем вашу задачу', 'со стратегическим', 'обоснованием'],
  fields: {
    name: 'Имя',
    company: 'Компания',
    contact: 'Контакт для связи',
    brief: 'Кратко о задаче',
  },
  attach: 'Прикрепить файл',
  budgets: ['1–2 млн', '3–4 млн', '5–10 млн', '10+ млн'],
  submit: 'Оставить заявку',
  consent:
    'Отправляя сообщение, вы соглашаетесь с политикой обработки персональных данных',
  manager: { name: 'Анна Кузнецова', role: 'Ваш менеджер проекта' },
  contacts: {
    email: { label: 'E-mail', value: 'hello@tachos.ru' },
    phone: { label: 'Позвонить', value: '+7 930 688-38-38' },
    city: 'Волгоград ГОРОД ГЕРОЙ',
  },
  socialsTitle: 'Следите за нами в соц. сетях',
  socials: [
    { id: 'tg-studio', brand: 'TACHOS', label: 'Канал студии', kind: 'tg' },
    { id: 'tg-vadim', brand: 'ВАДИМ', label: 'Личный канал CEO', kind: 'tg' },
    { id: 'vk', brand: 'TACHOS', label: 'Сообщество в VK', kind: 'vk' },
    { id: 'yt', brand: 'TACHOS', label: 'Мы в Ютубе', kind: 'yt' },
    { id: 'portfolio', brand: 'TACHOS', label: 'Портфолио', kind: 'link' },
  ] as Social[],
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
