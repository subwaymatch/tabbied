// One place that knows where the API is.
//
// In production the site and the Worker are the same origin, so the base is
// empty and every call is a relative path - which is what lets the session
// cookie work with no CORS surface at all. In development `next dev` serves
// :3000 while the Worker runs on :8787, so the base is set by `npm run dev` and
// credentials have to be sent explicitly. Nothing else may hardcode a host.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export const apiUrl = (path: string) => `${API_BASE}${path}`;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * A JSON call to the platform tier. Throws ApiError carrying the server's own
 * message, because every error the API returns is written to be read by a
 * person - a quota notice, a rate-limit notice, a sign-in prompt.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    // The session lives in a cookie; a cross-port dev request drops it without
    // this, which reads as "signed out" for reasons nothing in the UI explains.
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok) {
    throw new ApiError(body?.error ?? `Request failed (${response.status})`, response.status);
  }

  return body as T;
}
