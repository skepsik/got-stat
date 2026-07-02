import { asc, eq } from 'drizzle-orm'

import type { CreatePlayerInput } from '@got-stat/shared'

import type { Db } from '../../db/client.js'
import { players } from '../../db/schema/index.js'

function normalizeTelegram(value?: string): string | null {
  if (!value) {
    return null
  }

  return value.replace(/^@/, '').toLowerCase()
}

function toPlayerResponse(player: typeof players.$inferSelect) {
  return {
    id: player.id,
    displayName: player.displayName,
    telegram: player.telegram,
    userId: player.userId,
    createdAt: player.createdAt.toISOString(),
  }
}

export async function listPlayers(db: Db) {
  const rows = await db.query.players.findMany({
    orderBy: [asc(players.displayName)],
  })

  return rows.map(toPlayerResponse)
}

export async function getPlayer(db: Db, playerId: string) {
  const player = await db.query.players.findFirst({
    where: eq(players.id, playerId),
  })

  return player ? toPlayerResponse(player) : null
}

export async function createPlayer(db: Db, input: CreatePlayerInput, createdBy?: string) {
  const [player] = await db.insert(players).values({
    displayName: input.displayName,
    telegram: normalizeTelegram(input.telegram),
    createdBy: createdBy ?? null,
  }).returning()

  return toPlayerResponse(player)
}
