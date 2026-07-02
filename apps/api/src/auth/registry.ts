import type { AuthProvider } from './types.js'

export class AuthProviderRegistry {
  private readonly providers = new Map<string, AuthProvider>()

  register(provider: AuthProvider): void {
    this.providers.set(provider.id, provider)
  }

  get(id: string): AuthProvider | undefined {
    return this.providers.get(id)
  }
}
