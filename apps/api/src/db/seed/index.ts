import { createDb } from '@/db/client';
import { gotGameTypeHouses, gotGameTypes, gotHouses } from '@/db/schema/index';
import { env } from '@/env';

import { gameTypes } from './data/gameTypes';
import { houses } from './data/houses';

const { db, client } = createDb(env.DATABASE_URL);

async function seedReferenceData() {
  await db
    .insert(gotHouses)
    .values(
      houses.map((house) => ({
        id: house.id,
        sortOrder: house.order,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(gotGameTypes)
    .values(
      gameTypes.map((type) => ({
        id: type.id,
        sortOrder: type.order,
        vassals: type.vassals ?? false,
      })),
    )
    .onConflictDoNothing();

  const links = gameTypes.flatMap((type) =>
    type.houses_ids.map((houseId) => ({
      gameTypeId: type.id,
      houseId,
    })),
  );

  if (links.length > 0) {
    await db.insert(gotGameTypeHouses).values(links).onConflictDoNothing();
  }
}

await seedReferenceData();

console.log('[seed] reference data applied');

await client.end();
