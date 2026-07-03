import { z } from 'zod';

export const gotResultInputSchema = z
  .object({
    houseId: z.string().min(1),
    playerId: z.string().uuid().nullable().optional(),
    score: z.number().int().min(0),
    landings: z.number().int().min(0),
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
  playedAt: z.string().datetime(),
  gameTypeId: z.string().min(1),
  results: z.array(gotResultInputSchema).min(1),
});

export const gotHouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sortOrder: z.number().int(),
});

export const gotGameTypeSchema = z.object({
  id: z.string(),
  label: z.string(),
  vassals: z.boolean(),
  houseIds: z.array(z.string()),
});

export const gotResultSchema = z.object({
  id: z.string().uuid(),
  houseId: z.string(),
  playerId: z.string().uuid().nullable(),
  score: z.number().int().min(0),
  landings: z.number().int().min(0),
  supply: z.number().int(),
  throne: z.number().int(),
});

export const gotGameSchema = z.object({
  id: z.string().uuid(),
  playedAt: z.string().datetime(),
  gameTypeId: z.string(),
  recordedBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  results: z.array(gotResultSchema),
});

export const leaderboardRatingModeSchema = z.enum(['average', 'elo']);

export const gotPlayerStatsSchema = z.object({
  playerId: z.string().uuid(),
  displayName: z.string(),
  totalGames: z.number().int(),
  totalScores: z.number().int(),
  rating: z.number().int(),
});

export const gotHouseStatsSchema = z.object({
  houseId: z.string(),
  name: z.string(),
  totalGames: z.number().int(),
  totalScores: z.number().int(),
  averageScore: z.number(),
});

export type LeaderboardRatingMode = z.infer<
  typeof leaderboardRatingModeSchema
>;

export type GotResultInput = z.infer<typeof gotResultInputSchema>;
export type CreateGotGameInput = z.infer<typeof createGotGameSchema>;
export type GotHouse = z.infer<typeof gotHouseSchema>;
export type GotGameType = z.infer<typeof gotGameTypeSchema>;
export type GotResult = z.infer<typeof gotResultSchema>;
export type GotGame = z.infer<typeof gotGameSchema>;
export type GotPlayerStats = z.infer<typeof gotPlayerStatsSchema>;
export type GotHouseStats = z.infer<typeof gotHouseStatsSchema>;
