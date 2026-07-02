import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), 'migrations')
const databaseUrl = process.env.DATABASE_URL ?? 'postgres://gotstat:gotstat@localhost:5433/gotstat'

const client = postgres(databaseUrl, { max: 1 })
const db = drizzle(client)

await migrate(db, { migrationsFolder })

console.log('[db] migrations applied')

await client.end()
