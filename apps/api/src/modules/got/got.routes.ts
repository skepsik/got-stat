import type { MiddlewareHandler } from 'hono';

import {
  createGotGameSchema,
  leaderboardRatingModeSchema,
} from '@got-stat/shared';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '@/app-env';
import type { Db } from '@/db/client';

import {
  createGotGame,
  deleteGotGame,
  getGotGame,
  getGotHouseStats,
  getGotHouseStatsById,
  getGotLeaderboard,
  getGotPlayerStats,
  listGotGames,
  listGotGameTypes,
  listGotHouses,
} from '@/modules/got/got.service';

export function createGotRoutes(
  db: Db,
  requireAuth: MiddlewareHandler<AppEnv>,
) {
  const app = new Hono<AppEnv>();

  app.get('/houses', async (c) =>
    c.json(await listGotHouses(db, c.get('locale'))),
  );
  app.get('/game-types', async (c) =>
    c.json(await listGotGameTypes(db, c.get('locale'))),
  );
  app.get('/games', async (c) => c.json(await listGotGames(db)));

  app.get('/games/:id', async (c) => {
    const game = await getGotGame(db, c.req.param('id'));
    if (!game) {
      throw new HTTPException(404, { message: 'Game not found' });
    }

    return c.json(game);
  });

  app.post('/games', requireAuth, async (c) => {
    const body = createGotGameSchema.parse(await c.req.json());

    try {
      const game = await createGotGame(db, body, c.get('userId'));
      return c.json(game, 201);
    } catch (error) {
      if (error instanceof Error) {
        throw new HTTPException(400, { message: error.message });
      }

      throw error;
    }
  });

  app.delete('/games/:id', requireAuth, async (c) => {
    const deleted = await deleteGotGame(db, c.req.param('id'));
    if (!deleted) {
      throw new HTTPException(404, { message: 'Game not found' });
    }

    return c.body(null, 204);
  });

  app.get('/stats/leaderboard', async (c) => {
    const ratingMode = leaderboardRatingModeSchema.parse(
      c.req.query('rating') ?? 'average',
    );

    return c.json(await getGotLeaderboard(db, ratingMode));
  });
  app.get('/stats/houses', async (c) =>
    c.json(await getGotHouseStats(db, c.get('locale'))),
  );

  app.get('/stats/houses/:houseId', async (c) => {
    const stats = await getGotHouseStatsById(
      db,
      c.req.param('houseId'),
      c.get('locale'),
    );
    if (!stats) {
      throw new HTTPException(404, { message: 'House not found' });
    }

    return c.json(stats);
  });

  app.get('/players/:playerId/stats', async (c) => {
    const ratingMode = leaderboardRatingModeSchema.parse(
      c.req.query('rating') ?? 'average',
    );
    const stats = await getGotPlayerStats(
      db,
      c.req.param('playerId'),
      ratingMode,
    );
    if (!stats) {
      throw new HTTPException(404, { message: 'Player not found' });
    }

    return c.json(stats);
  });

  return app;
}
