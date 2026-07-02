import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
})

export type AppConfig = z.infer<typeof envSchema>

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse({
    PORT: env.PORT ?? 3001,
    DATABASE_URL: env.DATABASE_URL ?? 'postgres://gotstat:gotstat@localhost:5433/gotstat',
    SESSION_SECRET: env.SESSION_SECRET ?? 'dev-session-secret-change-me',
    TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN || undefined,
  })
}
