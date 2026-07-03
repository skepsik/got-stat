import { z } from 'zod';

export const gotResultInputSchema = z
  .object({
    houseId: z.string().min(1),
    landings: z.number().int().min(0),
    playerId: z.string().uuid().nullable().optional(),
    score: z.number().int().min(0),
    supply: z.number().int(),
    throne: z.number().int(),
  })
  .superRefine((result, ctx) => {
    if (result.playerId != null) {
      if (result.supply < 1 || result.supply > 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'supply must be between 1 and 6',
          path: ['supply'],
        });
      }

      if (result.throne < 1 || result.throne > 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'throne must be between 1 and 8',
          path: ['throne'],
        });
      }
    }
  });

export const createGotGameSchema = z.object({
  gameTypeId: z.string().min(1),
  playedAt: z.string().datetime(),
  results: z.array(gotResultInputSchema).min(1),
});

export const gotHouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sortOrder: z.number().int(),
});

export const gotGameTypeSchema = z.object({
  houseIds: z.array(z.string()),
  id: z.string(),
  label: z.string(),
  vassals: z.boolean(),
});

export const gotResultSchema = z.object({
  houseId: z.string(),
  id: z.string().uuid(),
  landings: z.number().int().min(0),
  playerId: z.string().uuid().nullable(),
  score: z.number().int().min(0),
  supply: z.number().int(),
  throne: z.number().int(),
});

export const gotGameSchema = z.object({
  createdAt: z.string().datetime(),
  gameTypeId: z.string(),
  id: z.string().uuid(),
  playedAt: z.string().datetime(),
  recordedBy: z.string().uuid(),
  results: z.array(gotResultSchema),
});

export const leaderboardRatingModeSchema = z.enum(['average', 'elo']);

export const gotPlayerStatsSchema = z.object({
  displayName: z.string(),
  playerId: z.string().uuid(),
  rating: z.number().int(),
  totalGames: z.number().int(),
  totalScores: z.number().int(),
});

export const gotHouseStatsSchema = z.object({
  averageScore: z.number(),
  houseId: z.string(),
  name: z.string(),
  totalGames: z.number().int(),
  totalScores: z.number().int(),
});

export type CreateGotGameInput = z.infer<typeof createGotGameSchema>;

export type GotGame = z.infer<typeof gotGameSchema>;
export type GotGameType = z.infer<typeof gotGameTypeSchema>;
export type GotHouse = z.infer<typeof gotHouseSchema>;
export type GotHouseStats = z.infer<typeof gotHouseStatsSchema>;
export type GotPlayerStats = z.infer<typeof gotPlayerStatsSchema>;
export type GotResult = z.infer<typeof gotResultSchema>;
export type GotResultInput = z.infer<typeof gotResultInputSchema>;
export type LeaderboardRatingMode = z.infer<typeof leaderboardRatingModeSchema>;
