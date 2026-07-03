import { ru } from '@/i18n/locales/ru';

export type Locale = 'ru';

export const DEFAULT_LOCALE: Locale = 'ru';

const locales = {
  ru,
} as const;

export function isLocale(value: string): value is Locale {
  return value in locales;
}

export function resolveLocale(
  acceptLanguage: string | undefined,
  queryLocale?: string,
): Locale {
  if (queryLocale && isLocale(queryLocale)) {
    return queryLocale;
  }

  if (acceptLanguage?.toLowerCase().includes('ru')) {
    return 'ru';
  }

  return DEFAULT_LOCALE;
}

export function t(locale: Locale, key: string): string {
  return (
    resolveMessage(locale, key) ??
    resolveMessage(DEFAULT_LOCALE, key) ??
    key.split('.').at(-1) ??
    key
  );
}

export function tGameTypeLabel(locale: Locale, id: string): string {
  return t(locale, `got.gameTypes.${id}`);
}

export function tHouseName(locale: Locale, id: string): string {
  return t(locale, `got.houses.${id}`);
}

function resolveMessage(locale: Locale, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = locales[locale];

  for (const part of parts) {
    if (typeof current !== 'object' || current == null || !(part in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}
