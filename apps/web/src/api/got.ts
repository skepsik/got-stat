import type {
  GotGame,
  GotGameType,
  GotHouse,
  GotHouseStats,
  GotPlayerStats,
  LeaderboardRatingMode,
} from '@got-stat/shared';

import { api } from '@/api/client';

export function getGotGame(id: string) {
  return api<GotGame>(`/api/got/games/${id}`);
}

export function getGotHouseStats() {
  return api<GotHouseStats[]>('/api/got/stats/houses');
}

export function getGotLeaderboard(
  ratingMode: LeaderboardRatingMode = 'average',
) {
  return api<GotPlayerStats[]>(
    withRatingQuery('/api/got/stats/leaderboard', ratingMode),
  );
}

export function getGotPlayerStats(
  playerId: string,
  ratingMode: LeaderboardRatingMode = 'average',
) {
  return api<GotPlayerStats>(
    withRatingQuery(`/api/got/players/${playerId}/stats`, ratingMode),
  );
}

export function listGotGames() {
  return api<GotGame[]>('/api/got/games');
}

export function listGotGameTypes() {
  return api<GotGameType[]>('/api/got/game-types');
}

export function listGotHouses() {
  return api<GotHouse[]>('/api/got/houses');
}

function withRatingQuery(path: string, ratingMode: LeaderboardRatingMode) {
  const params = new URLSearchParams({ rating: ratingMode });
  return `${path}?${params.toString()}`;
}
