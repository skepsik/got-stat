import { z } from 'zod';

export const createPlayerSchema = z.object({
  displayName: z.string().min(1),
  telegram: z.string().min(1).optional(),
});

export const playerSchema = z.object({
  createdAt: z.string().datetime(),
  displayName: z.string(),
  id: z.string().uuid(),
  telegram: z.string().nullable(),
  userId: z.string().uuid().nullable(),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type Player = z.infer<typeof playerSchema>;
