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

`npm run db:seed` — справочники GoT (дома, типы игр).

`npm run db:import` — игроки и партии из `got-stat-initial` (`V0_DATA_DIR` в `.env`). Повторный импорт: `IMPORT_FORCE=true`.

`npm run db:setup` — up + migrate + seed + import.
