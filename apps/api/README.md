# @got-stat/api

Hono + Drizzle + PostgreSQL.

## Локальный запуск

```bash
cp .env.example .env          # из корня репо
npm run db:up                 # из корня: Postgres на :5433
npm run db:setup              # миграции + сиды
npm run dev:api               # :3001
```

Переменные: `DATABASE_URL`, `SESSION_SECRET`, `TELEGRAM_BOT_TOKEN` (для `POST /api/auth/telegram`).

Повторный импорт партий из v0: `SEED_FORCE=true npm run db:seed`.
