import type { CreatePlayerInput } from '@got-stat/shared';

import { asc, eq } from 'drizzle-orm';

import type { Db } from '@/db/client';

import { players } from '@/db/schema/index';

export async function createPlayer(
  db: Db,
  input: CreatePlayerInput,
  createdBy?: string,
) {
  const [player] = await db
    .insert(players)
    .values({
      createdBy: createdBy ?? null,
      displayName: input.displayName,
      telegram: normalizeTelegram(input.telegram),
    })
    .returning();

  return toPlayerResponse(player);
}

export async function getPlayer(db: Db, playerId: string) {
  const player = await db.query.players.findFirst({
    where: eq(players.id, playerId),
  });

  return player ? toPlayerResponse(player) : null;
}

export async function listPlayers(db: Db) {
  const rows = await db.query.players.findMany({
    orderBy: [asc(players.displayName)],
  });

  return rows.map(toPlayerResponse);
}

function normalizeTelegram(value?: string): null | string {
  if (!value) {
    return null;
  }

  return value.replace(/^@/, '').toLowerCase();
}

function toPlayerResponse(player: typeof players.$inferSelect) {
  return {
    createdAt: player.createdAt.toISOString(),
    displayName: player.displayName,
    id: player.id,
    telegram: player.telegram,
    userId: player.userId,
  };
}
