import type { AuthProviderRegistry } from '@/auth/registry';
import type { Db } from '@/db/client';
import type { Env } from '@/env';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  clearSessionCookie,
  createAuthMiddleware,
  getAuthMe,
  loginWithProvider,
  setSessionCookie,
} from '@/auth/service';
import { createGotRoutes } from '@/modules/got/got.routes';
import { createPlayersRoutes } from '@/modules/players/players.routes';

export function createApp(
  db: Db,
  config: Env,
  authRegistry: AuthProviderRegistry,
) {
  const app = new Hono();
  const requireAuth = createAuthMiddleware(config);

  app.get('/api/health', (c) => c.json({ ok: true }));

  app.post('/api/auth/telegram', async (c) => {
    if (!config.TELEGRAM_BOT_TOKEN) {
      throw new HTTPException(503, {
        message: 'Telegram auth is not configured',
      });
    }

    const result = await loginWithProvider(
      db,
      'telegram-widget',
      await c.req.json(),
      authRegistry,
    );
    if (!result) {
      throw new HTTPException(401, {
        message: 'Invalid Telegram auth payload',
      });
    }

    setSessionCookie(c, result.userId, config.SESSION_SECRET);
    const me = await getAuthMe(db, result.userId);
    return c.json(me);
  });

  app.post('/api/auth/logout', (c) => {
    clearSessionCookie(c);
    return c.body(null, 204);
  });

  app.get('/api/auth/me', requireAuth, async (c) => {
    const me = await getAuthMe(db, c.get('userId'));
    if (!me) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json(me);
  });

  app.route('/api/players', createPlayersRoutes(db, requireAuth));
  app.route('/api/got', createGotRoutes(db, requireAuth));

  return app;
}
