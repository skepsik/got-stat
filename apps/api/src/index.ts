import { serve } from '@hono/node-server'

import { createApp } from './app.js'
import { AuthProviderRegistry } from './auth/registry.js'
import { TelegramWidgetAuthProvider } from './auth/providers/telegram-widget.js'
import { loadConfig } from './config.js'
import { createDb } from './db/client.js'

const config = loadConfig()
const { db, client } = createDb(config.DATABASE_URL)

const authRegistry = new AuthProviderRegistry()
if (config.TELEGRAM_BOT_TOKEN) {
  authRegistry.register(new TelegramWidgetAuthProvider(config.TELEGRAM_BOT_TOKEN))
}

const app = createApp(db, config, authRegistry)

const server = serve({
  fetch: app.fetch,
  port: config.PORT,
}, (info) => {
  console.log(`[api] listening on :${info.port}`)
})

async function shutdown() {
  server.close()
  await client.end()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
