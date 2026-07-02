import { serve } from '@hono/node-server';

import { createApp } from '@/app';
import { TelegramWidgetAuthProvider } from '@/auth/providers/telegram-widget';
import { AuthProviderRegistry } from '@/auth/registry';
import { createDb } from '@/db/client';
import { env } from '@/env';

const { db, client } = createDb(env.DATABASE_URL);

const authRegistry = new AuthProviderRegistry();
if (env.TELEGRAM_BOT_TOKEN) {
  authRegistry.register(new TelegramWidgetAuthProvider(env.TELEGRAM_BOT_TOKEN));
}

const app = createApp(db, env, authRegistry);

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`[api] listening on :${info.port}`);
  },
);

async function shutdown() {
  server.close();
  await client.end();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
