import {
  compareResultsByPlacement,
  type GotResultPlacement,
  sortResultsByPlacement,
} from './ranking';

export const DEFAULT_ELO_RATING = 1500;
export const DEFAULT_ELO_K_FACTOR = 32;

export type EloConfig = {
  initialRating?: number;
  kFactor?: number;
};

export type EloGame = {
  playedAt: string;
  results: readonly EloGameResult[];
};

export type EloGameResult = GotResultPlacement & {
  playerId: null | string;
};

export type EloParticipant = GotResultPlacement & {
  playerId: string;
};

export function computeEloRatings(
  games: readonly EloGame[],
  config: EloConfig = {},
): Map<string, number> {
  const resolvedConfig: Required<EloConfig> = {
    initialRating: config.initialRating ?? DEFAULT_ELO_RATING,
    kFactor: config.kFactor ?? DEFAULT_ELO_K_FACTOR,
  };
  const ratings = new Map<string, number>();
  const sortedGames = [...games].sort(
    (left, right) =>
      new Date(left.playedAt).getTime() - new Date(right.playedAt).getTime(),
  );

  for (const game of sortedGames) {
    processEloGame(ratings, game, resolvedConfig);
  }

  return new Map(
    [...ratings.entries()].map(([playerId, rating]) => [
      playerId,
      Math.round(rating),
    ]),
  );
}

export function computePlayerElo(
  playerId: string,
  games: readonly EloGame[],
  config: EloConfig = {},
): number {
  return (
    computeEloRatings(games, config).get(playerId) ??
    config.initialRating ??
    DEFAULT_ELO_RATING
  );
}

function applyPairwiseUpdate(
  ratings: Map<string, number>,
  playerA: string,
  playerB: string,
  scoreA: number,
  deltaK: number,
  initialRating: number,
) {
  const ratingA = getRating(ratings, playerA, initialRating);
  const ratingB = getRating(ratings, playerB, initialRating);
  const delta = deltaK * (scoreA - expectedScore(ratingA, ratingB));

  ratings.set(playerA, ratingA + delta);
  ratings.set(playerB, ratingB - delta);
}

function expectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

function getRating(
  ratings: Map<string, number>,
  playerId: string,
  initialRating: number,
) {
  return ratings.get(playerId) ?? initialRating;
}

function processEloGame(
  ratings: Map<string, number>,
  game: EloGame,
  config: Required<EloConfig>,
) {
  const participants: EloParticipant[] = sortResultsByPlacement(
    game.results.filter(
      (result): result is EloParticipant => result.playerId != null,
    ),
  );

  if (participants.length < 2) {
    return;
  }

  const deltaK = config.kFactor / (participants.length - 1);

  for (let leftIndex = 0; leftIndex < participants.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < participants.length;
      rightIndex += 1
    ) {
      const left = participants[leftIndex];
      const right = participants[rightIndex];
      const placement = compareResultsByPlacement(left, right);

      if (placement === 0) {
        applyPairwiseUpdate(
          ratings,
          left.playerId,
          right.playerId,
          0.5,
          deltaK,
          config.initialRating,
        );
        continue;
      }

      const winner = placement < 0 ? left : right;
      const loser = placement < 0 ? right : left;

      applyPairwiseUpdate(
        ratings,
        winner.playerId,
        loser.playerId,
        1,
        deltaK,
        config.initialRating,
      );
    }
  }
}
