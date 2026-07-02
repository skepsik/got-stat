import type {
  GotGame,
  GotGameType,
  GotHouse,
  GotHouseStats,
  GotPlayerStats,
} from '@got-stat/shared';

import { api } from '@/api/client';

export function listGotHouses() {
  return api<GotHouse[]>('/api/got/houses');
}

export function listGotGameTypes() {
  return api<GotGameType[]>('/api/got/game-types');
}

export function listGotGames() {
  return api<GotGame[]>('/api/got/games');
}

export function getGotGame(id: string) {
  return api<GotGame>(`/api/got/games/${id}`);
}

export function getGotLeaderboard() {
  return api<GotPlayerStats[]>('/api/got/stats/leaderboard');
}

export function getGotHouseStats() {
  return api<GotHouseStats[]>('/api/got/stats/houses');
}

export function getGotPlayerStats(playerId: string) {
  return api<GotPlayerStats>(`/api/got/players/${playerId}/stats`);
}
