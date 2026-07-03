import type { AuthProvider } from '@/auth/types';

export class AuthProviderRegistry {
  private readonly providers = new Map<string, AuthProvider>();

  get(id: string): AuthProvider | undefined {
    return this.providers.get(id);
  }

  register(provider: AuthProvider): void {
    this.providers.set(provider.id, provider);
  }
}
