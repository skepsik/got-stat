# got-stat-v1

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

| Команда | Описание |
|---------|----------|
| `npm run dev` | dev-сервер фронта (:3000) |
| `npm run dev:api` | API (:3001) |
| `npm run db:up` | Postgres в Docker (:5433) |
| `npm run db:setup` | миграции + сиды |
| `npm run build` | production-сборка фронта |

Фронт проксирует `/api` → `http://localhost:3001` (см. `apps/web/vite.config.mts`).
