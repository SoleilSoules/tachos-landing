# Tachos — лендинг: что доделать перед продом (для Вадима)

Вёрстка на Next.js (static export → GitHub Pages). Верх и середина готовы, ниже — что нужно подключить/заменить живому инженеру. Отсортировано по важности.

## 🔴 Блокеры прода

### 1. Отправка письма — сейчас ЗАГЛУШКА, заявки никуда не уходят

`components/compose/ComposeProvider.tsx` → функция `sendMail`. Это демо-заглушка: ждёт 1.1с и резолвится (5% специально падают, чтобы было видно error-состояние). **Никакого сетевого запроса нет** — на статичном GitHub Pages бэкенда нет.

Нужно:

- Реализовать реальный транспорт: POST на свой эндпоинт / Formspree / почтовый сервис. (Статичный экспорт не даёт серверных route handlers — либо внешний сервис, либо вынести на отдельный бэкенд/функцию.)
- Внутри проверять `res.ok` и кидать на не-2xx (иначе 500/422 утекут как «успех»).
- **Удалить** `Math.random()`-reject (синтетическая ошибка для демо).

Письмо собирается в `lib/compose.ts` → `buildLetter(state)` (готовый `subject`/`body`). Контакт пользователя приходит в `submitLetter(contact)`.

## 🟠 Перед запуском

### 2. Шрифт рукописных акцентов

`app/fonts/Kurochkalapkoi.ttf` (подключён в `app/layout.tsx` через `next/font/local`, переменная `--font-script`, используется в hero-подзаголовке). **Проверить лицензию** на коммерческое использование. Если нельзя — заменить файл и `src` в layout.

### 3. Медиа-плейсхолдеры

- `components/sections/VideoBlock.tsx` — встроен ЧУЖОЙ клип с Kinescope (crauch.ru) как заглушка «студия изнутри». Заменить на свой ролик (свой Kinescope embed или self-hosted `<video>`).
- Картинки кейсов/отзывов/логотипов/аватаров в `public/figma/*` — экспортные плейсхолдеры из макета. Заменить на боевые ассеты.

### 4. Контент и реквизиты

- `lib/content.ts` — цены в `services*` помечены как плейсхолдеры (комментарий в файле), уточнить реальные.
- Футер, юр-строка: `components/sections/Footer.tsx` — одна строка «ООО «Тачос» · ИНН · адрес». Дополнить под РКН/152-ФЗ если потребуется (политика обработки ПДн и т.п.).

## Архитектурные заметки

- **Письмо-конструктор** живёт в `components/compose/`. Тело — `LetterBody.tsx` (общее), рендерится в модалке (`ComposeOverlay.tsx`) и inline в футере (`Footer.tsx`); выбор синхронизирован через общий стейт `ComposeProvider.tsx` (`useCompose`). Черновик автосейвится в localStorage (`lib/useComposeDraft.ts`), без PII (152-ФЗ).
- **Маскот Начос** — `CursorCompanion.tsx` (RAF-физика, без библиотек). Режимы: companion (у курсора) / form (у открытой модалки) / announce (CTA/кейсы) / **footer-perch** (садится в `[data-mascot-perch]` в футере, увеличивается, следит глазами). Скрыт при `prefers-reduced-motion` и на touch.
- Стек: Next 16 + React 19 + TS strict + Tailwind 3.4. **Важно:** в репо `AGENTS.md` — у этой версии Next есть отличия от привычного API, см. `node_modules/next/dist/docs/`.
- Деплой: `npm run build` → static export в `out/` → GitHub Pages (`basePath`/`asset()` для путей). Репо `SoleilSoules/tachos-landing`, прод https://soleilsoules.github.io/tachos-landing/.
