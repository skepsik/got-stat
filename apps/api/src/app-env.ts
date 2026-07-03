import type { Locale } from '@/i18n/index';

export type AppEnv = {
  Variables: {
    locale: Locale;
    userId: string;
  };
};
