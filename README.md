# got-stat-v1

Monorepo для статистики GoT: фронтенд + будущий бэкенд.

## Структура

```
apps/
  web/          Vue 3 + Vuetify 4 + Vite (фронтенд)
  api/          HTTP API, БД, авторизация (заглушка)
packages/
  shared/       общие типы и утилиты для web и api
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
| `npm run dev:api` | заглушка API (:3001) |
| `npm run build` | production-сборка фронта |

Фронт проксирует `/api` → `http://localhost:3001` (см. `apps/web/vite.config.mts`).
