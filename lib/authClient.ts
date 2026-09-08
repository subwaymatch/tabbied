'use client';

import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { API_BASE } from './apiFetch';

// The browser half of better-auth.
//
// `baseURL` is set only when there is a real one to set - in development, where
// the site is :3000 and the Worker is :8787. In production they are the same
// origin, and the client infers it from `window.location` with better-auth's
// own default basePath, which is the `/api/auth` the Worker mounts.
//
// Passing a relative `/api/auth` instead would look equivalent and is not: the
// client validates the URL at construction, and construction happens at module
// scope - during the static export, where there is no origin to resolve it
// against. That threw the whole prerender of every page importing this.
export const authClient = createAuthClient({
  ...(API_BASE ? { baseURL: `${API_BASE}/api/auth` } : {}),
  // Roles, bans, impersonation - the admin pages call these directly; the
  // server's own role gate is what actually decides.
  plugins: [adminClient()],
});

export const { signIn, signUp } = authClient;

/** What the UI actually needs off a session. */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  /** Set by the admin plugin; 'admin' opens /admin. */
  role?: string | null;
};

/**
 * better-auth infers the session type from the *server* config, which lives in
 * worker/ - deliberately outside the site's tsconfig, because it compiles
 * against workerd's globals rather than the DOM. So the client cannot see it
 * and types `data` as `never`.
 *
 * Rather than sprinkle casts at every call site, the narrowing happens once,
 * here, against the shape above. If the session ever grows a field the UI
 * needs, this type is the one place to add it.
 */
export function useSessionUser(): {
  user: SessionUser | null;
  isPending: boolean;
} {
  const { data, isPending } = authClient.useSession();
  const session = data as unknown as { user?: SessionUser } | null;

  return { user: session?.user ?? null, isPending };
}

export const signOut = () => authClient.signOut({});
