import { count, eq } from 'drizzle-orm';

import { createDb } from '@/db/client';
import {
  gotGames,
  gotGameTypeHouses,
  gotGameTypes,
  gotHouses,
  gotResults,
  players,
  users,
} from '@/db/schema/index';
import { games } from '@/db/seed/data/games';
import { gameTypes } from '@/db/seed/data/gameTypes';
import { houses } from '@/db/seed/data/houses';
import { users as legacyPlayers } from '@/db/seed/data/users';
import { env } from '@/env';

const { db, client } = createDb(env.DATABASE_URL);

function playerDisplayName(entry: {
  telegram?: string;
  name?: string;
  id: string;
}): string {
  if (entry.name) {
    return entry.name;
  }

  if (entry.telegram) {
    return `@${entry.telegram}`;
  }

  return entry.id;
}

function normalizeTelegram(value?: string): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/^@/, '').toLowerCase();
}

async function seedReferenceData() {
  await db
    .insert(gotHouses)
    .values(
      houses.map((house) => ({
        id: house.id,
        name: house.name,
        sortOrder: house.order,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(gotGameTypes)
    .values(
      gameTypes.map((type) => ({
        id: type.id,
        label: type.label,
        vassals: type.vassals ?? false,
      })),
    )
    .onConflictDoNothing();

  const links = gameTypes.flatMap((type) =>
    type.houses_ids.map((houseId) => ({
      gameTypeId: type.id,
      houseId,
    })),
  );

  if (links.length > 0) {
    await db.insert(gotGameTypeHouses).values(links).onConflictDoNothing();
  }
}

async function ensureSystemUser() {
  const existing = await db.query.users.findFirst({
    where: eq(users.isSystem, true),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(users)
    .values({
      displayName: 'System',
      isSystem: true,
    })
    .returning();

  return created;
}

async function seedPlayers() {
  const playerIdByLegacy = new Map<string, string>();

  for (const entry of legacyPlayers) {
    const [player] = await db
      .insert(players)
      .values({
        legacyId: entry.id,
        displayName: playerDisplayName(entry),
        telegram: normalizeTelegram(entry.telegram),
      })
      .onConflictDoNothing()
      .returning();

    if (player) {
      playerIdByLegacy.set(entry.id, player.id);
      continue;
    }

    const existing = await db.query.players.findFirst({
      where: eq(players.legacyId, entry.id),
    });

    if (existing) {
      playerIdByLegacy.set(entry.id, existing.id);
    }
  }

  return playerIdByLegacy;
}

async function seedGames(
  systemUserId: string,
  playerIdByLegacy: Map<string, string>,
) {
  const [existingGames] = await db.select({ value: count() }).from(gotGames);
  const existingCount = existingGames?.value ?? 0;

  if (existingCount >= games.length) {
    console.log('[seed] games already present, skipping import');
    return;
  }

  if (existingCount > 0) {
    if (!env.SEED_FORCE) {
      console.warn(
        `[seed] found ${existingCount}/${games.length} games; set SEED_FORCE=true to reimport`,
      );
      return;
    }

    await db.delete(gotResults);
    await db.delete(gotGames);
  }

  for (const game of games) {
    const [createdGame] = await db
      .insert(gotGames)
      .values({
        playedAt: new Date(Number(game.played_at)),
        gameTypeId: game.type_id,
        recordedBy: systemUserId,
      })
      .returning();

    await db.insert(gotResults).values(
      game.results.map((result) => {
        const houseId = 'house' in result ? result.house : result.house_id;

        return {
          gameId: createdGame.id,
          houseId,
          playerId: result.user_id
            ? (playerIdByLegacy.get(result.user_id) ?? null)
            : null,
          score: result.score,
          landings: result.landings,
          supply: result.supply,
          throne: result.throne,
        };
      }),
    );
  }
}

async function main() {
  await seedReferenceData();
  const systemUser = await ensureSystemUser();
  const playerIdByLegacy = await seedPlayers();
  await seedGames(systemUser.id, playerIdByLegacy);

  console.log('[seed] completed');
}

await main();
await client.end();
