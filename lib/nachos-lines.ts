// Tachos Nachos (the mascot) does NOT read an element's label back to the user — he
// says something OF HIS OWN about whatever's under the cursor: a take, an inside
// fact, a nudge. Lines are grouped by the KIND of thing (data-hint carries a machine
// key, data-hint-sub the entity) and picked at random, never repeating the previous
// line. Facts come strictly from lib/content.ts — he never invents numbers.
//
// What makes him feel alive:
//  • per-ENTITY pools — doki gets doki lines, QA gets QA lines, «Складно» gets its
//    real facts, not one shared template with a name slotted in;
//  • he REMEMBERS: the second hover of the same thing gets a «ты вернулся» line
//    (CursorCompanion counts visits per entity and passes the count in);
//  • his voice is one character throughout — the studio's straight-talking sidekick.

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

// First token of a "Имя Фамилия · статус" string → just the first name to riff on.
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
  'generic',
]);

// data-hint = machine category key, data-hint-sub = the entity to riff on.
// Unknown/missing keys fall back to a generic clickable.
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

// ─── Per-entity pools ──────────────────────────────────────────────────────
// Real-fact lines for cases — every figure exists in lib/content.ts.
const CASE_FACTS: Record<string, string[]> = {
  Складно: [
    'Склад без людей: ячейку открываешь телефоном.',
    '95 точек по стране — и ни одного кладовщика.',
    'Бронь, оплата, Bluetooth-доступ — все наше.',
  ],
  Хайс: [
    'Банк для ИП с нуля. Счет, бухгалтерия, валюта.',
    'Анти-фрод зашит прямо в SDK. Тихо и надежно.',
    'Целый банк в одном приложении. Наших рук дело.',
  ],
  Maginary: [
    'Книга, где читатель — герой. 750 тысяч загрузок.',
    'Тапни — покажу, как оживает книга.',
    'Книга-игра под iOS. Мы ее собрали.',
  ],
  Monte: [
    'Тюнинг-студия. Вся их цифра — наша работа.',
    'У них моторы, у нас код. Сошлись.',
    'Сайт и сервисы для Monte собрали мы.',
  ],
  Добрый: [
    'Игра за четыре недели. Засекали.',
    'Бренд соков №1 — и наша игра к их промо.',
    'От идеи до прода за месяц. Могем.',
  ],
};

const CASE_GENERIC = [
  '{name}? За этим кейсом я слежу лично.',
  'Тут живая история, не красивый скрин.',
  'За {name} мы попотели. Оно того стоило.',
];

// Own products — the id from content.ts is the key (data-hint-sub={p.id}).
const PRODUCT_LINES: Record<string, string[]> = {
  doki: [
    'doki — все наши доки живут в нем. Порядок.',
    'Победили хаос в документах. Себе первым.',
    'Сами сидим в doki каждый день.',
  ],
  hub: [
    'MonteHub — склад без единой таблицы.',
    'Приемка, остатки, логистика — одно окно.',
    'Собрали для себя. Оказалось — надо всем.',
  ],
  standby: [
    'Standby держит фокус, когда все горит.',
    'Задачи и таймеры на одной доске, в реалтайме.',
    'Наш ответ вечному «а что я вообще делаю».',
  ],
};

const PRODUCT_GENERIC = ['Это мы для себя сварганили. И гордимся.', 'Рабочая лошадка, не показуха.'];

// Team roles — keys are the lowercased card labels from Services.
const ROLE_LINES: Record<string, string[]> = {
  'продуктовый ux/ui дизайнер': [
    'Наш дизайнер сперва думает, потом рисует.',
    'Интерфейсы у нас не «красиво», а «работает».',
  ],
  'арт-директор': [
    'Арт-дир следит, чтобы было красиво. Строго.',
    'Мимо арт-дира ни один пиксель не проскочит.',
  ],
  'дизайн-директор': [
    'Дизайн-директор отвечает за всю картинку разом.',
    'Спор о вкусе? Тут последнее слово.',
  ],
  'frontend-разработчик': [
    'Все, что ты тут видишь, — работа фронта.',
    'Фронт соберет так, что глаз не оторвешь.',
  ],
  'backend-разработчик': [
    'Бэкенд держит все, чего не видно.',
    'Сервер не падает — скажи спасибо бэкенду.',
  ],
  'системный аналитик': [
    'Аналитик разложит твой хаос по полочкам.',
    'Переводит с человеческого на технический.',
  ],
  'продуктовый аналитик': [
    'Считает не клики, а пользу.',
    'Цифры любит больше, чем я — подсказки.',
  ],
  'qa-специалист': [
    'QA найдет баг даже в этой подсказке.',
    'Ломает все до релиза. Чтобы после — никто.',
  ],
  'devops-инженер': [
    'DevOps — чтобы релиз в пятницу не пугал.',
    'Деплой в одну кнопку — это к DevOps.',
  ],
};

const ROLE_GENERIC = [
  'Свои, в штате. Никакого аутсорса.',
  'Живой спец, не подрядчик.',
  'Сидит через стол от меня. Честно.',
];

// Blog posts — keys are the post slugs from content.ts.
const BLOG_LINES: Record<string, string[]> = {
  'igra-dlya-dobrogo': [
    'Как мы игру за месяц вывезли — вся кухня тут.',
    'Прототип за пару дней. Читай, как это было.',
  ],
  'razrabotka-ne-utopia': [
    'Про наш процесс. Без воды и обещаний.',
    'Фикс-прайс и демо на каждом этапе — тут детали.',
  ],
  'ustroistvo-dlya-drifta': [
    'Мы и железо умеем. Вот доказательство.',
    'Девайс для дрифтеров: телеметрия, прошивка — сами.',
  ],
};

const BLOG_GENERIC = [
  'Сами набили эти шишки — делимся.',
  'Из практики, не из умной книжки.',
  'Мы и писать умеем, не только код гонять.',
];

// Nav links — keys are the link labels from content.ts nav.
const NAV_LINES: Record<string, string[]> = {
  Кейсы: [
    'Мое портфолио. Ну ладно — наше.',
    'Сразу к делу? Уважаю.',
    'Пять живых историй, я в каждой копался.',
  ],
  Отзывы: [
    'Там говорят клиенты, не мы.',
    'Пойдем подслушаем, что о нас говорят.',
    'Самое честное место на сайте.',
  ],
  Контакты: [
    'Там письмо, которое пишет себя само.',
    'Один клик — и мы знакомы.',
    'Загляни, я помогу собрать письмо.',
  ],
  Медиа: [
    'Там мы без галстуков.',
    'Пишем сами, по своим шишкам.',
    'Глянь, как студия живет изнутри.',
  ],
};

const NAV_GENERIC = ['Веди — я тут знаю все углы.'];

// ─── Flat pools for everything else ────────────────────────────────────────
const LINES: Record<
  Exclude<
    NachosCategory,
    'case' | 'product' | 'role' | 'blog' | 'nav'
  >,
  string[]
> = {
  switcher: [
    'Полистай — их у нас три.',
    'Переключай, покажу остальные.',
    'Любимого продукта нет. Все любимые.',
  ],
  review: [
    'Это слова {name}, не нашего копирайтера.',
    '{name} говорит как есть, без прикрас.',
    '{name} с нами не первый год.',
  ],
  player: [
    'Жми play — голос живой, не нейронка.',
    'Тут и перемотка работает. Я проверял.',
    'Шесть минут правды про нашу работу.',
  ],
  hero: [
    'Печатай как есть — дальше моя забота.',
    'Опиши по-человечески, без ТЗ.',
    'Не знаешь, с чего начать? Просто начни.',
    'Пара слов — и я передам кому надо.',
  ],
  voice: [
    'Лень печатать? Диктуй, я запишу.',
    'Жми и говори. По-русски понимаю.',
    'Голосом даже быстрее.',
  ],
  send: [
    'Жми — соберем из этого письмо.',
    'Enter тоже работает, кстати.',
    'Готово? Отправляй, не думай.',
  ],
  contact: [
    'Кинь контакт — не потеряю, обещаю.',
    'Телега, почта, телефон — что удобнее.',
    'Сюда придет ответ. Лично тебе.',
  ],
  founder: [
    'Это {name}. Отвечает сам, я проверял.',
    'Основатель на связи. Без секретарей.',
    'Потаскай кружок — он не обидится.',
  ],
  'nav-cta': [
    'Жми — ответит живой человек.',
    'Смелее, письмо почти само пишется.',
    'Самая важная кнопка тут. Я проверял.',
  ],
  logo: ['Это дом. Мой тоже.', 'Наверх? Подброшу.', 'Тачос. Запомни это имя.'],
  tab: [
    'Фильтрую кейсы, не благодари.',
    'Банки, игры, магазины — у нас всякое было.',
    'Выбирай направление, я подсвечу.',
  ],
  'more-cases': [
    'Там еще есть. Жми, покажу.',
    'Четыре — это не все, разворачивай.',
    'У нас запасы кейсов. Доставай.',
  ],
  studio: [
    'Это мы. В естественной среде обитания.',
    'Офис настоящий, не стоковый.',
    'Где-то там мой угол. Не скажу где.',
  ],
  'footer-mail': [
    'Тык — и почта в буфере.',
    'Скопируй и напиши, когда удобно.',
    'Отвечаем быстрее, чем ты думаешь.',
  ],
  'footer-phone': [
    'Можно голосом — мы не кусаемся.',
    'Тык — и номер в буфере.',
    'Звони, там живые люди.',
  ],
  manager: [
    'Анна первой увидит твое письмо.',
    'Отвечает по делу и без спама.',
    'Письма читает Анна. Настоящая.',
  ],
  rodina: ['Родина-мать. Мы из Волгограда.', 'Город-герой, без шуток.', 'Тут наш дом. И Волга.'],
  floating: [
    'Это письмо-кнопка. Всегда рядом.',
    'Поймал мысль? Неси сюда.',
    '20 секунд — и письмо готово.',
  ],
  generic: [
    'О, сюда ткни — не пожалеешь.',
    'Тут кое-что интересное. Глянь.',
    'Это стоит клика, зуб даю.',
    'Смелее, я рядом.',
  ],
};

// «You're back» lines — served exactly on the SECOND look at the same entity
// (third+ goes back to the normal pool so he doesn't nag about it).
const CASE_RETURNING = [
  'Опять {name}? Залипательно, да.',
  'Вернулся к {name} — хороший знак. Жми.',
  'Второй заход. Открывай уже.',
];
const RETURNING = [
  'Опять ты тут? Хороший вкус.',
  'Вернулся — значит, зацепило.',
  'Второй раз смотришь. Решайся.',
];

const fill = (line: string, name: string) => line.replace(/\{name\}/g, name);

function pool(category: NachosCategory, name: string): string[] {
  switch (category) {
    case 'case':
      return CASE_FACTS[name] ?? CASE_GENERIC;
    case 'product':
      return PRODUCT_LINES[name] ?? PRODUCT_GENERIC;
    case 'role':
      return ROLE_LINES[name] ?? ROLE_GENERIC;
    case 'blog':
      return BLOG_LINES[name] ?? BLOG_GENERIC;
    case 'nav':
      return NAV_LINES[name] ?? NAV_GENERIC;
    default:
      return LINES[category];
  }
}

// Pick a line for the category, substituting the name and avoiding an exact repeat
// of the previous line. `visit` is how many times the user has hovered THIS entity
// (1-based) — the second visit gets a "you're back" line.
export function nachosLine(
  category: NachosCategory,
  name: string,
  opts: { avoid?: string; visit?: number } = {},
): string {
  const { avoid, visit = 1 } = opts;
  const source = visit === 2 ? (category === 'case' ? CASE_RETURNING : RETURNING) : pool(category, name);
  const filled = source.map((l) => fill(l, name));
  const fresh = filled.length > 1 && avoid ? filled.filter((l) => l !== avoid) : filled;
  return fresh[Math.floor(Math.random() * fresh.length)] ?? filled[0] ?? '';
}
