export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'ru',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let message = response.statusText;

    try {
      const body = (await response.json()) as { message?: string };
      message = body.message ?? message;
    } catch {
      // ignore non-json errors
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
