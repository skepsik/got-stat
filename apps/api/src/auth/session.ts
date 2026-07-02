import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'got_stat_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface SessionPayload {
  userId: string;
  exp: number;
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(value: string): SessionPayload | null {
  try {
    return JSON.parse(
      Buffer.from(value, 'base64url').toString('utf8'),
    ) as SessionPayload;
  } catch {
    return null;
  }
}

export function createSessionToken(userId: string, secret: string): string {
  const payload = encodePayload({
    userId,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const signature = sign(payload, secret);

  return `${payload}.${signature}`;
}

export function parseSessionToken(
  token: string | undefined,
  secret: string,
): string | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload, secret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  const decoded = decodePayload(payload);
  if (!decoded || decoded.exp < Date.now()) {
    return null;
  }

  return decoded.userId;
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export { SESSION_COOKIE };
