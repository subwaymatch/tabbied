import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';
import type { Env } from './env';
import { isDev } from './env';
import { sendMail } from './lib/mail';

// better-auth over D1, built per request.
//
// It is a factory for the same reason `buildServer` is one on the MCP side:
// a Worker isolate is shared across requests and across *environments* during
// local dev, so capturing bindings in a module-scope singleton is a bug that
// only shows up under concurrency. Construction is cheap - no I/O - and the
// expensive part (session lookup) is a KV read, not a rebuild.

function socialProviders(env: Env) {
  const providers: Record<string, { clientId: string; clientSecret: string }> = {};

  // A provider is configured or it is absent - never half-declared, which
  // renders a sign-in button that 500s on click.
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }
  if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
    providers.apple = {
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: env.APPLE_CLIENT_SECRET,
    };
  }

  return providers;
}

/**
 * The providers the sign-in form may offer, in the order it shows them. The
 * form asks `/api/auth-providers` rather than guessing, so the only buttons
 * it draws are for providers this deployment can actually complete.
 */
export function configuredProviders(env: Env): string[] {
  const configured = socialProviders(env);

  return ['google', 'apple', 'github'].filter((name) => name in configured);
}

/** Is this address in ADMIN_EMAILS? Empty or unset means nobody is. */
export function isConfiguredAdmin(env: Env, email: string): boolean {
  const configured = (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);

  return configured.includes(email.trim().toLowerCase());
}

export function buildAuth(env: Env) {
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    // Missing in dev is survivable (the account is throwaway); missing in
    // production would silently sign cookies with a constant, so it throws
    // there via the same check the routes make before mounting.
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.PUBLIC_ORIGIN,
    basePath: '/api/auth',

    // Roles, bans and impersonation. The first admin is granted by hand
    // (`npm run admin:grant -- you@example.com`); after that /admin/users does
    // it. Every /api/admin/* route reads the role server-side - the pages
    // hiding themselves is cosmetic.
    plugins: [admin()],

    // Admins by configuration. `ADMIN_EMAILS` names accounts that get the role
    // without anyone running the grant script: set on the row as it is
    // created, and - for an account that predates the setting - set the next
    // time that person signs in. Compared case-insensitively, since an email
    // is.
    databaseHooks: {
      user: {
        create: {
          before: async (data) => ({
            data: isConfiguredAdmin(env, data.email) ? { ...data, role: 'admin' } : data,
          }),
        },
      },
      session: {
        create: {
          after: async (created) => {
            const [row] = await db
              .select({ email: schema.user.email, role: schema.user.role })
              .from(schema.user)
              .where(eq(schema.user.id, created.userId))
              .limit(1);

            if (row && row.role !== 'admin' && isConfiguredAdmin(env, row.email)) {
              await db
                .update(schema.user)
                .set({ role: 'admin' })
                .where(eq(schema.user.id, created.userId));
            }
          },
        },
      },
    },

    database: drizzleAdapter(db, { provider: 'sqlite', schema }),

    session: {
      // A signed, short-lived copy of the session in the cookie itself, so the
      // common case - an authenticated request - costs no database read at
      // all. Five minutes is the upstream default and the right trade here:
      // revoking a session takes at most that long to be felt, and the
      // endpoints that spend money re-check nothing more sensitive than
      // identity.
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },

    rateLimit: {
      // The default is an in-memory map, which is per-isolate - a distributed
      // brute force against the credential endpoints would be counted as a
      // handful of unrelated attempts. D1 is shared, so it is one count.
      storage: 'database',
    },

    emailAndPassword: {
      enabled: true,
      // The account exists but cannot sign in until the link is followed. The
      // AI endpoints check the session, so this is also the first gate on
      // spending money for a throwaway address.
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendMail(env, {
          to: user.email,
          subject: 'Reset your Tabbied password',
          url,
          text: `Reset your Tabbied password:\n\n${url}\n\nIf you didn't ask for this, ignore it.`,
        });
      },
    },

    user: {
      // Deleting an account is the person's to do; with no verification mail
      // configured better-auth asks for the password instead, which is the
      // right friction for the only irreversible thing on the settings page.
      deleteUser: { enabled: true },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail(env, {
          to: user.email,
          subject: 'Confirm your Tabbied account',
          url,
          text: `Confirm your Tabbied account:\n\n${url}`,
        });
      },
    },

    socialProviders: socialProviders(env),

    advanced: {
      // The site and the API are the same origin in production, so the cookie
      // needs no cross-site relaxation. In dev they are :3000 and :8787, which
      // is cross-*port* - same-site by the cookie spec - so only Secure has to
      // give way for plain http.
      useSecureCookies: !isDev(env),
    },

    // Dev only, and any loopback origin rather than a list of ports. The site
    // runs on :3000 while the Worker runs on :8787, `npm run preview` picks its
    // own, and a test harness picks another again - a hardcoded pair silently
    // rejects every one it does not name, as "Invalid origin", which reads like
    // a bug in the form rather than a missing entry here.
    //
    // In production this returns nothing and the origin check falls back to
    // baseURL, which is the whole point of being same-origin.
    trustedOrigins: (request) => {
      if (!isDev(env) || !request) {
        return [];
      }

      const origin = request.headers.get('origin');

      if (!origin) {
        return [];
      }

      const { hostname } = new URL(origin);

      return hostname === 'localhost' || hostname === '127.0.0.1' ? [origin] : [];
    },
  });
}

export type Auth = ReturnType<typeof buildAuth>;
