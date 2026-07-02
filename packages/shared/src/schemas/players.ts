import { z } from 'zod';

export const createPlayerSchema = z.object({
  displayName: z.string().min(1),
  telegram: z.string().min(1).optional(),
});

export const playerSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string(),
  telegram: z.string().nullable(),
  userId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type Player = z.infer<typeof playerSchema>;
