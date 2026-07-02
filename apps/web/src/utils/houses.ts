const houseColors: Record<string, string> = {
  arren: '#708090',
  barateon: '#f4c542',
  grayjoy: '#1f2937',
  lannister: '#c1121f',
  martell: '#e85d04',
  stark: '#9ca3af',
  targarien: '#111827',
  tyrell: '#2a9d8f',
};

export function houseColor(id: string) {
  return houseColors[id] ?? '#5c6bc0';
}
