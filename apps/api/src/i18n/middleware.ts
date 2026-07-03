import type { MiddlewareHandler } from 'hono';

import type { AppEnv } from '@/app-env';

import { resolveLocale } from '@/i18n/index';

export function localeMiddleware(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const locale = resolveLocale(
      c.req.header('Accept-Language'),
      c.req.query('locale'),
    );

    c.set('locale', locale);
    await next();
  };
}
