import { relations } from 'drizzle-orm'

import { gotGameTypeHouses, gotGameTypes, gotGames, gotHouses, gotResults, players, userIdentities, users } from './index.js'

export const usersRelations = relations(users, ({ many, one }) => ({
  identities: many(userIdentities),
  player: one(players, {
    fields: [users.id],
    references: [players.userId],
  }),
}))

export const userIdentitiesRelations = relations(userIdentities, ({ one }) => ({
  user: one(users, {
    fields: [userIdentities.userId],
    references: [users.id],
  }),
}))

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [players.createdBy],
    references: [users.id],
  }),
  results: many(gotResults),
}))

export const gotHousesRelations = relations(gotHouses, ({ many }) => ({
  gameTypeLinks: many(gotGameTypeHouses),
  results: many(gotResults),
}))

export const gotGameTypesRelations = relations(gotGameTypes, ({ many }) => ({
  houses: many(gotGameTypeHouses),
  games: many(gotGames),
}))

export const gotGameTypeHousesRelations = relations(gotGameTypeHouses, ({ one }) => ({
  gameType: one(gotGameTypes, {
    fields: [gotGameTypeHouses.gameTypeId],
    references: [gotGameTypes.id],
  }),
  house: one(gotHouses, {
    fields: [gotGameTypeHouses.houseId],
    references: [gotHouses.id],
  }),
}))

export const gotGamesRelations = relations(gotGames, ({ one, many }) => ({
  gameType: one(gotGameTypes, {
    fields: [gotGames.gameTypeId],
    references: [gotGameTypes.id],
  }),
  recordedByUser: one(users, {
    fields: [gotGames.recordedBy],
    references: [users.id],
  }),
  results: many(gotResults),
}))

export const gotResultsRelations = relations(gotResults, ({ one }) => ({
  game: one(gotGames, {
    fields: [gotResults.gameId],
    references: [gotGames.id],
  }),
  house: one(gotHouses, {
    fields: [gotResults.houseId],
    references: [gotHouses.id],
  }),
  player: one(players, {
    fields: [gotResults.playerId],
    references: [players.id],
  }),
}))
