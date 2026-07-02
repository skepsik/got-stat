export function formatGameDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function playerLabel(
  displayName: string | undefined,
  telegram: string | null | undefined,
) {
  if (telegram) {
    return `@${telegram}`;
  }

  return displayName ?? '—';
}

export function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index] as T;
    copy[index] = copy[swapIndex] as T;
    copy[swapIndex] = current;
  }

  return copy;
}
