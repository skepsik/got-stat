import type { AuthProviderRegistry } from '@/auth/registry';
import type { AuthUser } from '@/auth/types';
import type { Db } from '@/db/client';
import type { Env } from '@/env';
import type { Context, MiddlewareHandler } from 'hono';
import { and, eq } from 'drizzle-orm';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import {
  createSessionToken,
  getSessionCookieName,
  parseSessionToken,
} from '@/auth/session';
import { players, userIdentities, users } from '@/db/schema/index';

type AuthEnv = {
  Variables: {
    userId: string;
  };
};

export function createAuthMiddleware(config: Env): MiddlewareHandler<AuthEnv> {
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

export function optionalAuthMiddleware(
  config: Env,
): MiddlewareHandler<AuthEnv> {
  return async (c, next) => {
    const token = getCookie(c, getSessionCookieName());
    const userId = parseSessionToken(token, config.SESSION_SECRET);

    if (userId) {
      c.set('userId', userId);
    }

    await next();
  };
}

export async function loginWithProvider(
  db: Db,
  providerId: string,
  input: unknown,
  registry: AuthProviderRegistry,
): Promise<{ userId: string } | null> {
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
    userId: createdUser.id,
    provider: providerId,
    providerUid: authUser.providerUid,
    username: authUser.username ?? null,
    rawData: authUser.raw,
  });

  await linkPlayerByTelegram(db, createdUser.id, authUser.username);
  return createdUser.id;
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

export function setSessionCookie(
  c: Context,
  userId: string,
  secret: string,
): void {
  setCookie(c, getSessionCookieName(), createSessionToken(userId, secret), {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function clearSessionCookie(c: Context): void {
  setCookie(c, getSessionCookieName(), '', {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  });
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
    user: {
      id: user.id,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    },
    player: player
      ? {
          id: player.id,
          displayName: player.displayName,
          telegram: player.telegram,
          userId: player.userId,
          createdAt: player.createdAt.toISOString(),
        }
      : null,
  };
}

export type { AuthEnv };
