export interface AuthProvider {
  authenticate(input: unknown): Promise<AuthUser | null>;
  readonly id: string;
}

export interface AuthUser {
  displayName: string;
  providerUid: string;
  raw: Record<string, unknown>;
  username?: string;
}
