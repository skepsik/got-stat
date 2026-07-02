export function computeRating(totalScores: number, totalGames: number): number {
  if (totalGames === 0) {
    return 0
  }

  return Math.round((100 * totalScores) / totalGames)
}
