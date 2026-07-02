import type { AppEnv } from '@/app-env';
import type { Db } from '@/db/client';
import type { MiddlewareHandler } from 'hono';

import { createPlayerSchema } from '@got-stat/shared';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  createPlayer,
  getPlayer,
  listPlayers,
} from '@/modules/players/players.service';

export function createPlayersRoutes(
  db: Db,
  requireAuth: MiddlewareHandler<AppEnv>,
) {
  const app = new Hono<AppEnv>();

  app.get('/', async (c) => c.json(await listPlayers(db)));

  app.get('/:id', async (c) => {
    const player = await getPlayer(db, c.req.param('id'));
    if (!player) {
      throw new HTTPException(404, { message: 'Player not found' });
    }

    return c.json(player);
  });

  app.post('/', requireAuth, async (c) => {
    const body = createPlayerSchema.parse(await c.req.json());
    const player = await createPlayer(db, body, c.get('userId'));
    return c.json(player, 201);
  });

  return app;
}
