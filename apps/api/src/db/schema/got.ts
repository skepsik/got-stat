import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { players, users } from '@/db/schema/core';

export const gotHouses = pgTable('got_houses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const gotGameTypes = pgTable('got_game_types', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  vassals: boolean('vassals').notNull().default(false),
});

export const gotGameTypeHouses = pgTable(
  'got_game_type_houses',
  {
    gameTypeId: text('game_type_id')
      .notNull()
      .references(() => gotGameTypes.id, { onDelete: 'cascade' }),
    houseId: text('house_id')
      .notNull()
      .references(() => gotHouses.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.gameTypeId, table.houseId] })],
);

export const gotGames = pgTable('got_games', {
  id: uuid('id').primaryKey().defaultRandom(),
  playedAt: timestamp('played_at', { withTimezone: true }).notNull(),
  gameTypeId: text('game_type_id')
    .notNull()
    .references(() => gotGameTypes.id),
  recordedBy: uuid('recorded_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const gotResults = pgTable(
  'got_results',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references(() => gotGames.id, { onDelete: 'cascade' }),
    houseId: text('house_id')
      .notNull()
      .references(() => gotHouses.id),
    playerId: uuid('player_id').references(() => players.id, {
      onDelete: 'set null',
    }),
    score: smallint('score').notNull(),
    landings: smallint('landings').notNull(),
    supply: smallint('supply').notNull(),
    throne: smallint('throne').notNull(),
  },
  (table) => [unique('got_results_game_house').on(table.gameId, table.houseId)],
);
