# got-stat

Monorepo для статистики GoT: фронтенд + бэкенд.

## Структура

```
apps/
  web/          Vue 3 + Vuetify 4 + Vite (фронтенд)
  api/          Hono API, PostgreSQL, Drizzle
packages/
  shared/       Zod-схемы и типы для web и api
```

## Node

```bash
fnm use    # Node 22 (.nvmrc)
npm install
```

## Скрипты (из корня)

| Команда            | Описание                                                                     |
| ------------------ | ---------------------------------------------------------------------------- |
| `npm run dev`      | dev-сервер фронта (:3000)                                                    |
| `npm run dev:api`  | API (:3001)                                                                  |
| `npm run db:up`    | Postgres в Docker (порт из `POSTGRES_HOST_PORT` в `.env`, по умолчанию 5434) |
| `npm run db:setup` | миграции + сиды                                                              |
| `npm run build`    | production-сборка фронта                                                     |

Фронт проксирует `/api` → `http://localhost:3001` (см. `apps/web/vite.config.ts`).

## Локальный `.env`

```bash
cp .env.example .env
```

Порт Postgres на хосте: `POSTGRES_HOST_PORT` (должен совпадать с портом в `DATABASE_URL`).
Машиноспецифичные настройки — только в `.env`, не в git.
