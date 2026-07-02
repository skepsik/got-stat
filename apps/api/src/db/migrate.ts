import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { env } from '@/env';

const migrationsFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  'migrations',
);

const maxAttempts = 10;
const retryDelayMs = 1000;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder });
    console.log('[db] migrations applied');
    await client.end();
    break;
  } catch (error) {
    await client.end({ timeout: 1 }).catch(() => undefined);

    const cause = error instanceof Error && 'cause' in error ? error.cause : error;
    const code =
      cause instanceof Error && 'code' in cause
        ? String(cause.code)
        : error instanceof Error && 'code' in error
          ? String(error.code)
          : undefined;

    const retryable =
      code === 'ECONNREFUSED' || code === 'ECONNRESET' || code === 'ETIMEDOUT';

    if (!retryable || attempt === maxAttempts) {
      throw error;
    }

    console.log(
      `[db] database not ready (attempt ${attempt}/${maxAttempts}), retrying...`,
    );
    await sleep(retryDelayMs);
  }
}
