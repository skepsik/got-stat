import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const apiSrc = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(apiSrc, '../../..');

for (const envFile of [
  resolve(repoRoot, '.env'),
  resolve(repoRoot, 'apps/api/.env'),
]) {
  if (existsSync(envFile)) {
    loadDotenv({ path: envFile });
  }
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgres://gotstat:gotstat@localhost:5434/gotstat'),
  SESSION_SECRET: z.string().min(16).default('dev-session-secret-change-me'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  V0_DATA_DIR: z.string().default('../got-stat-initial'),
  IMPORT_FORCE: z
    .enum(['true', 'false', '1', '0'])
    .default('false')
    .transform((value) => value === 'true' || value === '1'),
});

function readProcessEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    V0_DATA_DIR: process.env.V0_DATA_DIR,
    IMPORT_FORCE: process.env.IMPORT_FORCE,
  };
}

export const env = envSchema.parse(readProcessEnv());
export type Env = z.infer<typeof envSchema>;
