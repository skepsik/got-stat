export interface AuthUser {
  providerUid: string
  username?: string
  displayName: string
  raw: Record<string, unknown>
}

export interface AuthProvider {
  readonly id: string
  authenticate(input: unknown): Promise<AuthUser | null>
}
