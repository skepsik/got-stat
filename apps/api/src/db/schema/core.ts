import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  displayName: text('display_name').notNull(),
  id: uuid('id').primaryKey().defaultRandom(),
  isSystem: boolean('is_system').notNull().default(false),
});

export const userIdentities = pgTable(
  'user_identities',
  {
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    id: uuid('id').primaryKey().defaultRandom(),
    provider: text('provider').notNull(),
    providerUid: text('provider_uid').notNull(),
    rawData: jsonb('raw_data'),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    username: text('username'),
  },
  (table) => [
    unique('user_identities_provider_uid').on(
      table.provider,
      table.providerUid,
    ),
  ],
);

export const players = pgTable('players', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdBy: uuid('created_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  displayName: text('display_name').notNull(),
  id: uuid('id').primaryKey().defaultRandom(),
  telegram: text('telegram'),
  userId: uuid('user_id')
    .unique()
    .references(() => users.id, { onDelete: 'set null' }),
});
