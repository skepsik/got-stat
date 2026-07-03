import type { Context, MiddlewareHandler } from 'hono';

import { and, eq } from 'drizzle-orm';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '@/app-env';
import type { AuthProviderRegistry } from '@/auth/registry';
import type { AuthUser } from '@/auth/types';
import type { Db } from '@/db/client';
import type { Env } from '@/env';

import {
  createSessionToken,
  getSessionCookieName,
  parseSessionToken,
} from '@/auth/session';
import { players, userIdentities, users } from '@/db/schema/index';

export function clearSessionCookie(c: Context): void {
  setCookie(c, getSessionCookieName(), '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'Lax',
  });
}

export function createAuthMiddleware(config: Env): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const token = getCookie(c, getSessionCookieName());
    const userId = parseSessionToken(token, config.SESSION_SECRET);

    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    c.set('userId', userId);
    await next();
  };
}

export async function getAuthMe(db: Db, userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return null;
  }

  const player = await db.query.players.findFirst({
    where: eq(players.userId, userId),
  });

  return {
    player: player
      ? {
          createdAt: player.createdAt.toISOString(),
          displayName: player.displayName,
          id: player.id,
          telegram: player.telegram,
          userId: player.userId,
        }
      : null,
    user: {
      createdAt: user.createdAt.toISOString(),
      displayName: user.displayName,
      id: user.id,
    },
  };
}

export async function loginWithProvider(
  db: Db,
  providerId: string,
  input: unknown,
  registry: AuthProviderRegistry,
): Promise<null | { userId: string }> {
  const provider = registry.get(providerId);
  if (!provider) {
    return null;
  }

  const authUser = await provider.authenticate(input);
  if (!authUser) {
    return null;
  }

  const userId = await upsertAuthUser(db, providerId, authUser);
  return { userId };
}

export function optionalAuthMiddleware(config: Env): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const token = getCookie(c, getSessionCookieName());
    const userId = parseSessionToken(token, config.SESSION_SECRET);

    if (userId) {
      c.set('userId', userId);
    }

    await next();
  };
}

export function setSessionCookie(
  c: Context,
  userId: string,
  secret: string,
): void {
  setCookie(c, getSessionCookieName(), createSessionToken(userId, secret), {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'Lax',
  });
}

async function linkPlayerByTelegram(
  db: Db,
  userId: string,
  username?: string,
): Promise<void> {
  if (!username) {
    return;
  }

  const normalized = username.replace(/^@/, '').toLowerCase();
  const candidate = await db.query.players.findFirst({
    where: eq(players.telegram, normalized),
  });

  if (!candidate || candidate.userId) {
    return;
  }

  await db.update(players).set({ userId }).where(eq(players.id, candidate.id));
}

async function upsertAuthUser(
  db: Db,
  providerId: string,
  authUser: AuthUser,
): Promise<string> {
  const existingIdentity = await db.query.userIdentities.findFirst({
    where: and(
      eq(userIdentities.provider, providerId),
      eq(userIdentities.providerUid, authUser.providerUid),
    ),
  });

  if (existingIdentity) {
    await linkPlayerByTelegram(db, existingIdentity.userId, authUser.username);
    return existingIdentity.userId;
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      displayName: authUser.displayName,
    })
    .returning();

  await db.insert(userIdentities).values({
    provider: providerId,
    providerUid: authUser.providerUid,
    rawData: authUser.raw,
    userId: createdUser.id,
    username: authUser.username ?? null,
  });

  await linkPlayerByTelegram(db, createdUser.id, authUser.username);
  return createdUser.id;
}

export type { AppEnv as AuthEnv };
