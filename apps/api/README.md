# @got-stat/api

Hono + Drizzle + PostgreSQL.

## Локальный запуск

```bash
cp .env.example .env          # из корня репо
npm run db:up                 # Postgres, порт = POSTGRES_HOST_PORT
npm run db:setup              # миграции + справочники
npm run dev:api               # :3001
```

`.env` в корне репо подхватывается API, migrate и seed автоматически.

Переменные: `POSTGRES_HOST_PORT`, `DATABASE_URL`, `SESSION_SECRET`, `TELEGRAM_BOT_TOKEN`.

## Сиды

`npm run db:seed` — справочники GoT (дома, типы игр). Запускается через `db:setup`.

Начальные данные (игроки, партии) на прод — через дамп при первом деплое.
