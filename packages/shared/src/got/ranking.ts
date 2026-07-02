export type GotResultPlacement = {
  landings: number;
  score: number;
  supply: number;
  throne: number;
};

export function compareResultsByPlacement(
  left: GotResultPlacement,
  right: GotResultPlacement,
): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if (right.landings !== left.landings) {
    return right.landings - left.landings;
  }

  if (right.supply !== left.supply) {
    return right.supply - left.supply;
  }

  return left.throne - right.throne;
}

export function sortResultsByPlacement<T extends GotResultPlacement>(
  results: readonly T[],
): T[] {
  return [...results].sort(compareResultsByPlacement);
}
