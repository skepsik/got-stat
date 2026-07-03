import type { Db } from '@/db/client';
import type { Locale } from '@/i18n/index';

import {
  computeEloRatings,
  computeRating,
  type CreateGotGameInput,
  DEFAULT_ELO_RATING,
  type EloGame,
  type LeaderboardRatingMode,
  sortResultsByPlacement,
} from '@got-stat/shared';
import { asc, desc, eq, inArray, sql } from 'drizzle-orm';
import {
  gotGames,
  gotGameTypeHouses,
  gotGameTypes,
  gotHouses,
  gotResults,
  players,
} from '@/db/schema/index';
import { tGameTypeLabel, tHouseName } from '@/i18n/index';

function toGameResponse(
  game: typeof gotGames.$inferSelect,
  results: Array<typeof gotResults.$inferSelect>,
) {
  return {
    id: game.id,
    playedAt: game.playedAt.toISOString(),
    gameTypeId: game.gameTypeId,
    recordedBy: game.recordedBy,
    createdAt: game.createdAt.toISOString(),
    results: sortResultsByPlacement(
      results.map((result) => ({
        id: result.id,
        houseId: result.houseId,
        playerId: result.playerId,
        score: result.score,
        landings: result.landings,
        supply: result.supply,
        throne: result.throne,
      })),
    ),
  };
}

export async function listGotHouses(db: Db, locale: Locale) {
  const rows = await db.query.gotHouses.findMany({
    orderBy: [asc(gotHouses.sortOrder)],
  });

  return rows.map((house) => ({
    id: house.id,
    name: tHouseName(locale, house.id),
    sortOrder: house.sortOrder,
  }));
}

export async function listGotGameTypes(db: Db, locale: Locale) {
  const types = await db.query.gotGameTypes.findMany({
    orderBy: [asc(gotGameTypes.sortOrder)],
  });

  const links = await db.query.gotGameTypeHouses.findMany();
  const housesByType = new Map<string, string[]>();

  for (const link of links) {
    const current = housesByType.get(link.gameTypeId) ?? [];
    current.push(link.houseId);
    housesByType.set(link.gameTypeId, current);
  }

  return types.map((type) => ({
    id: type.id,
    label: tGameTypeLabel(locale, type.id),
    vassals: type.vassals,
    houseIds: housesByType.get(type.id) ?? [],
  }));
}

export async function listGotGames(db: Db) {
  const games = await db.query.gotGames.findMany({
    orderBy: [desc(gotGames.playedAt)],
    with: {
      results: true,
    },
  });

  return games.map((game) => toGameResponse(game, game.results));
}

export async function getGotGame(db: Db, gameId: string) {
  const game = await db.query.gotGames.findFirst({
    where: eq(gotGames.id, gameId),
    with: {
      results: true,
    },
  });

  return game ? toGameResponse(game, game.results) : null;
}

async function validateGameInput(db: Db, input: CreateGotGameInput) {
  const gameType = await db.query.gotGameTypes.findFirst({
    where: eq(gotGameTypes.id, input.gameTypeId),
  });

  if (!gameType) {
    throw new Error('Unknown game type');
  }

  const expectedHouses = await db.query.gotGameTypeHouses.findMany({
    where: eq(gotGameTypeHouses.gameTypeId, input.gameTypeId),
  });
  const expectedHouseIds = new Set(expectedHouses.map((item) => item.houseId));
  const inputHouseIds = input.results.map((result) => result.houseId);

  if (inputHouseIds.length !== expectedHouseIds.size) {
    throw new Error(
      'Results must include every house for the selected game type',
    );
  }

  if (new Set(inputHouseIds).size !== inputHouseIds.length) {
    throw new Error('Duplicate houses in results');
  }

  for (const houseId of inputHouseIds) {
    if (!expectedHouseIds.has(houseId)) {
      throw new Error(
        `House ${houseId} is not valid for game type ${input.gameTypeId}`,
      );
    }
  }

  const vassalCount = input.results.filter(
    (result) => result.playerId == null,
  ).length;
  if (gameType.vassals) {
    if (vassalCount !== 1) {
      throw new Error('Vassal game type requires exactly one vassal result');
    }
  } else if (vassalCount > 0) {
    throw new Error('Vassal results are not allowed for this game type');
  }

  if (!gameType.vassals) {
    for (const result of input.results) {
      if (!result.playerId) {
        throw new Error('Player is required for every result');
      }
    }
  }

  const playerIds = input.results
    .map((result) => result.playerId)
    .filter((value): value is string => value != null);

  if (playerIds.length > 0) {
    const existingPlayers = await db.query.players.findMany({
      where: inArray(players.id, playerIds),
    });

    if (existingPlayers.length !== new Set(playerIds).size) {
      throw new Error('Unknown player in results');
    }
  }
}

export async function createGotGame(
  db: Db,
  input: CreateGotGameInput,
  recordedBy: string,
) {
  await validateGameInput(db, input);

  const [game] = await db
    .insert(gotGames)
    .values({
      playedAt: new Date(input.playedAt),
      gameTypeId: input.gameTypeId,
      recordedBy,
    })
    .returning();

  const resultRows = await db
    .insert(gotResults)
    .values(
      input.results.map((result) => ({
        gameId: game.id,
        houseId: result.houseId,
        playerId: result.playerId ?? null,
        score: result.score,
        landings: result.landings,
        supply: result.supply,
        throne: result.throne,
      })),
    )
    .returning();

  return toGameResponse(game, resultRows);
}

async function listGamesForElo(db: Db): Promise<EloGame[]> {
  const games = await db.query.gotGames.findMany({
    orderBy: [asc(gotGames.playedAt)],
    with: {
      results: true,
    },
  });

  return games.map((game) => ({
    playedAt: game.playedAt.toISOString(),
    results: game.results.map((result) => ({
      playerId: result.playerId,
      score: result.score,
      landings: result.landings,
      supply: result.supply,
      throne: result.throne,
    })),
  }));
}

function resolveLeaderboardRating(
  ratingMode: LeaderboardRatingMode,
  row: {
    playerId: string;
    totalGames: number;
    totalScores: number;
  },
  eloRatings: Map<string, number> | null,
) {
  if (ratingMode === 'elo') {
    return eloRatings?.get(row.playerId) ?? DEFAULT_ELO_RATING;
  }

  return computeRating(row.totalScores, row.totalGames);
}

export async function deleteGotGame(db: Db, gameId: string) {
  const deleted = await db
    .delete(gotGames)
    .where(eq(gotGames.id, gameId))
    .returning();

  return deleted.length > 0;
}

export async function getGotLeaderboard(
  db: Db,
  ratingMode: LeaderboardRatingMode = 'average',
) {
  const rows = await db
    .select({
      playerId: players.id,
      displayName: players.displayName,
      totalGames: sql<number>`count(${gotResults.id})::int`,
      totalScores: sql<number>`coalesce(sum(${gotResults.score}), 0)::int`,
    })
    .from(players)
    .innerJoin(gotResults, eq(gotResults.playerId, players.id))
    .groupBy(players.id, players.displayName)
    .orderBy(
      desc(
        sql`coalesce(sum(${gotResults.score}), 0)::float / nullif(count(${gotResults.id}), 0)`,
      ),
    );

  const eloRatings =
    ratingMode === 'elo'
      ? computeEloRatings(await listGamesForElo(db))
      : null;

  const leaderboard = rows.map((row) => ({
    playerId: row.playerId,
    displayName: row.displayName,
    totalGames: row.totalGames,
    totalScores: row.totalScores,
    rating: resolveLeaderboardRating(ratingMode, row, eloRatings),
  }));

  if (ratingMode === 'elo') {
    return leaderboard.sort((left, right) => right.rating - left.rating);
  }

  return leaderboard;
}

export async function getGotPlayerStats(
  db: Db,
  playerId: string,
  ratingMode: LeaderboardRatingMode = 'average',
) {
  const player = await db.query.players.findFirst({
    where: eq(players.id, playerId),
  });

  if (!player) {
    return null;
  }

  const [stats] = await db
    .select({
      totalGames: sql<number>`count(${gotResults.id})::int`,
      totalScores: sql<number>`coalesce(sum(${gotResults.score}), 0)::int`,
    })
    .from(gotResults)
    .where(eq(gotResults.playerId, playerId));

  const totalGames = stats?.totalGames ?? 0;
  const totalScores = stats?.totalScores ?? 0;
  const eloRatings =
    ratingMode === 'elo'
      ? computeEloRatings(await listGamesForElo(db))
      : null;

  return {
    playerId: player.id,
    displayName: player.displayName,
    totalGames,
    totalScores,
    rating: resolveLeaderboardRating(
      ratingMode,
      {
        playerId: player.id,
        totalGames,
        totalScores,
      },
      eloRatings,
    ),
  };
}

export async function getGotHouseStats(db: Db, locale: Locale) {
  const rows = await db
    .select({
      houseId: gotHouses.id,
      sortOrder: gotHouses.sortOrder,
      totalGames: sql<number>`count(${gotResults.id})::int`,
      totalScores: sql<number>`coalesce(sum(${gotResults.score}), 0)::int`,
    })
    .from(gotHouses)
    .leftJoin(gotResults, eq(gotResults.houseId, gotHouses.id))
    .groupBy(gotHouses.id, gotHouses.sortOrder)
    .orderBy(asc(gotHouses.sortOrder));

  return rows.map((row) => ({
    houseId: row.houseId,
    name: tHouseName(locale, row.houseId),
    totalGames: row.totalGames,
    totalScores: row.totalScores,
    averageScore: row.totalGames > 0 ? row.totalScores / row.totalGames : 0,
  }));
}

export async function getGotHouseStatsById(
  db: Db,
  houseId: string,
  locale: Locale,
) {
  const all = await getGotHouseStats(db, locale);
  return all.find((item) => item.houseId === houseId) ?? null;
}
