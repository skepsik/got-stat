import { createHash, createHmac } from 'node:crypto'

import { telegramAuthSchema } from '@got-stat/shared'

import type { AuthProvider, AuthUser } from '../types.js'

function buildDataCheckString(payload: Record<string, string | number | undefined>): string {
  return Object.entries(payload)
    .filter(([key, value]) => key !== 'hash' && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}

export class TelegramWidgetAuthProvider implements AuthProvider {
  readonly id = 'telegram-widget'

  constructor(private readonly botToken: string) {}

  async authenticate(input: unknown): Promise<AuthUser | null> {
    const parsed = telegramAuthSchema.safeParse(input)
    if (!parsed.success) {
      return null
    }

    const payload = parsed.data
    const authAgeSeconds = Math.floor(Date.now() / 1000) - payload.auth_date
    if (authAgeSeconds > 86_400) {
      return null
    }

    const dataCheckString = buildDataCheckString({
      auth_date: payload.auth_date,
      first_name: payload.first_name,
      id: payload.id,
      last_name: payload.last_name,
      photo_url: payload.photo_url,
      username: payload.username,
    })

    const secretKey = createHash('sha256').update(this.botToken).digest()
    const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    if (expectedHash !== payload.hash) {
      return null
    }

    const displayName = [payload.first_name, payload.last_name].filter(Boolean).join(' ')
      || (payload.username ? `@${payload.username}` : `Telegram ${payload.id}`)

    return {
      providerUid: String(payload.id),
      username: payload.username,
      displayName,
      raw: payload,
    }
  }
}
