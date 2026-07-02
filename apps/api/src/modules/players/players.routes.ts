import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { MiddlewareHandler } from 'hono'

import { createPlayerSchema } from '@got-stat/shared'

import type { AuthEnv } from '../../auth/service.js'
import type { Db } from '../../db/client.js'
import { createPlayer, getPlayer, listPlayers } from './players.service.js'

export function createPlayersRoutes(db: Db, requireAuth: MiddlewareHandler<AuthEnv>) {
  const app = new Hono<AuthEnv>()

  app.get('/', async (c) => c.json(await listPlayers(db)))

  app.get('/:id', async (c) => {
    const player = await getPlayer(db, c.req.param('id'))
    if (!player) {
      throw new HTTPException(404, { message: 'Player not found' })
    }

    return c.json(player)
  })

  app.post('/', requireAuth, async (c) => {
    const body = createPlayerSchema.parse(await c.req.json())
    const player = await createPlayer(db, body, c.get('userId'))
    return c.json(player, 201)
  })

  return app
}
