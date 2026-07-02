import type { Player } from '@got-stat/shared';

import { api } from '@/api/client';

export function listPlayers() {
  return api<Player[]>('/api/players');
}
