import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { MiddlewareHandler } from 'hono'

import { createGotGameSchema } from '@got-stat/shared'

import type { AuthEnv } from '../../auth/service.js'
import type { Db } from '../../db/client.js'
import {
  createGotGame,
  deleteGotGame,
  getGotGame,
  getGotHouseStats,
  getGotHouseStatsById,
  getGotLeaderboard,
  getGotPlayerStats,
  listGotGameTypes,
  listGotGames,
  listGotHouses,
} from './got.service.js'

export function createGotRoutes(db: Db, requireAuth: MiddlewareHandler<AuthEnv>) {
  const app = new Hono<AuthEnv>()

  app.get('/houses', async (c) => c.json(await listGotHouses(db)))
  app.get('/game-types', async (c) => c.json(await listGotGameTypes(db)))
  app.get('/games', async (c) => c.json(await listGotGames(db)))

  app.get('/games/:id', async (c) => {
    const game = await getGotGame(db, c.req.param('id'))
    if (!game) {
      throw new HTTPException(404, { message: 'Game not found' })
    }

    return c.json(game)
  })

  app.post('/games', requireAuth, async (c) => {
    const body = createGotGameSchema.parse(await c.req.json())

    try {
      const game = await createGotGame(db, body, c.get('userId'))
      return c.json(game, 201)
    } catch (error) {
      if (error instanceof Error) {
        throw new HTTPException(400, { message: error.message })
      }

      throw error
    }
  })

  app.delete('/games/:id', requireAuth, async (c) => {
    const deleted = await deleteGotGame(db, c.req.param('id'))
    if (!deleted) {
      throw new HTTPException(404, { message: 'Game not found' })
    }

    return c.body(null, 204)
  })

  app.get('/stats/leaderboard', async (c) => c.json(await getGotLeaderboard(db)))
  app.get('/stats/houses', async (c) => c.json(await getGotHouseStats(db)))

  app.get('/stats/houses/:houseId', async (c) => {
    const stats = await getGotHouseStatsById(db, c.req.param('houseId'))
    if (!stats) {
      throw new HTTPException(404, { message: 'House not found' })
    }

    return c.json(stats)
  })

  app.get('/players/:playerId/stats', async (c) => {
    const stats = await getGotPlayerStats(db, c.req.param('playerId'))
    if (!stats) {
      throw new HTTPException(404, { message: 'Player not found' })
    }

    return c.json(stats)
  })

  return app
}
