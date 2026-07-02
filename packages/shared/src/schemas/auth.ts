import { z } from 'zod';

import { playerSchema } from './players';

export const telegramAuthSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number().int().positive(),
  hash: z.string().min(1),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string(),
  createdAt: z.string().datetime(),
});

export const authMeSchema = z.object({
  user: userSchema,
  player: playerSchema.nullable(),
});

export type TelegramAuthInput = z.infer<typeof telegramAuthSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthMe = z.infer<typeof authMeSchema>;
