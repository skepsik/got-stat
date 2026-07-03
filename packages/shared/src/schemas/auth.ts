import { z } from 'zod';

import { playerSchema } from './players';

export const telegramAuthSchema = z.object({
  auth_date: z.number().int().positive(),
  first_name: z.string().optional(),
  hash: z.string().min(1),
  id: z.number().int().positive(),
  last_name: z.string().optional(),
  photo_url: z.string().optional(),
  username: z.string().optional(),
});

export const userSchema = z.object({
  createdAt: z.string().datetime(),
  displayName: z.string(),
  id: z.string().uuid(),
});

export const authMeSchema = z.object({
  player: playerSchema.nullable(),
  user: userSchema,
});

export type AuthMe = z.infer<typeof authMeSchema>;
export type TelegramAuthInput = z.infer<typeof telegramAuthSchema>;
export type User = z.infer<typeof userSchema>;
