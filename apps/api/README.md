# @got-stat/api

Hono + Drizzle + PostgreSQL.

## Локальный запуск

```bash
cp .env.example .env          # из корня репо
npm run db:up                 # Postgres, порт = POSTGRES_HOST_PORT
npm run db:setup              # миграции + сиды
npm run dev:api               # :3001
```

`.env` в корне репо подхватывается API, migrate и seed автоматически.

Переменные: `POSTGRES_HOST_PORT`, `DATABASE_URL`, `SESSION_SECRET`, `TELEGRAM_BOT_TOKEN`.

Повторный импорт партий из v0: `SEED_FORCE=true npm run db:seed`.
