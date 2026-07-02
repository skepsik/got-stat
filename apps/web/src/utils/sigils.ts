const sigilUrls = import.meta.glob<string>('../assets/sigils/*.png', {
  eager: true,
  import: 'default',
});

const sigilsById = Object.fromEntries(
  Object.entries(sigilUrls).map(([path, url]) => {
    const id = path.match(/\/([^/]+)\.png$/)?.[1];

    return id ? [id, url] : [];
  }),
);

export function getSigilFromId(id: string) {
  return sigilsById[id] ?? '';
}
