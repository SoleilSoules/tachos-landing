# Feedback-форма — серверная часть (для Вадима)

Фронт формы обратной связи («Нашли ошибку?» в шапке) готов и в проде работает в **демо-режиме** (ничего не отправляет). Осталась серверная часть — приём фидбека и создание GitHub Issue.

Тачос — статический экспорт (GitHub Pages), своего рантайма нет → нужен внешний endpoint (Vercel-функция / любой serverless). GitHub-токен с `issues:write` держать **только на сервере**, в браузер класть нельзя.

## Точка интеграции (фронт уже готов)

- Компонент: `components/feedback/FeedbackWidget.tsx`; точка входа — кнопка «Нашли ошибку?» в `components/sections/Nav.tsx` (`data-feedback`).
- Env: **`NEXT_PUBLIC_FEEDBACK_ENDPOINT`**. Пусто → демо (показывает «Спасибо», не шлёт). Задан → фронт делает `POST <endpoint>` с JSON ниже; по 2xx — успех, иначе — ошибка/ретрай.

## Payload (JSON, `Content-Type: application/json`)

```jsonc
{
  "type": "bug" | "idea",
  "title": "string (≤200)",
  "body":  "string (≤4000, обязательное)",
  "email": "string (≤200, опц.)",
  "attachments": ["data:image/png;base64,...", "..."],
  "url": "страница, откуда отправили",
  "userAgent": "...",
  "viewport": "1440x900"
}
```

Скриншоты — массив data-URL. Лимиты уже провалены на клиенте (продублируй на сервере, как твой `parseAttachments` в doki): **≤8 шт, ≤5 МБ каждый, только `image/(png|jpeg|gif|webp)`**.

## Что нужно от endpoint

1. CORS на домен Тачоса (`https://soleilsoules.github.io`) + обработать preflight `OPTIONS`.
2. Валидация (лимиты выше; `body` обязателен).
3. Создать **GitHub Issue** — ровно как в doki (`apps/editor/lib/github-bugs.ts`): заголовок `[bug|idea] <первые ~80 символов>`, тело — body + метаданные (url / userAgent / viewport / email). Скриншоты вложить ссылками (у тебя уже есть паттерн `/api/bug-screenshot/[id]`).
4. Простой антиспам / rate-limit (в doki его пока нет — можно сразу заложить). На фронте уже стоит honeypot.

## Нюанс

⚠️ У Vercel serverless лимит тела запроса ~4.5 МБ — 8 скриншотов по 5 МБ разом не пройдут. Варианты: добавить на фронт проверку суммарного размера, либо грузить скриншоты отдельным запросом. Для обычных скринов бага хватает.

Репо для issues — на твой выбор (предложение: `SoleilSoules/tachos-landing`).
