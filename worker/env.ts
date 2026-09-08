/**
 * Everything the Worker is handed at runtime. `ASSETS` is the original binding
 * and still serves the overwhelming majority of requests; the rest arrived with
 * the platform tier (see agent-outputs/20260827-studio-ai-plan.md).
 *
 * Secrets are typed optional because they genuinely are: the Worker boots and
 * serves the site with none of them set, and each feature degrades on its own
 * (no AI key -> the matcher answers; no mail key -> verification links go to D1).
 * That is what keeps a missing secret a narrow failure instead of a dead site.
 */
export type Env = {
  ASSETS: { fetch(request: Request | string): Promise<Response> };

  DB: D1Database;
  MEDIA: R2Bucket;

  PUBLIC_ORIGIN: string;
  AI_BASE_URL: string;
  AI_MODEL: string;
  AI_IMAGE_MODEL: string;

  /**
   * Sent as `reasoning.effort` on every Responses call, and omitted entirely
   * when unset - a non-reasoning model, and some OpenAI-compatible servers,
   * reject the field. The rungs are the GPT-5.6 family's: `none` is what
   * GPT-5 spelled `minimal`, and either way the bottom of the ladder is what
   * keeps `max_output_tokens` spent on the document rather than on reasoning.
   */
  AI_REASONING_EFFORT?: 'none' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';

  BETTER_AUTH_SECRET?: string;
  AI_API_KEY?: string;
  RESEND_API_KEY?: string;
  /**
   * Comma-separated emails that are admins by configuration: granted the role
   * when the account is created and, for an account that already exists,
   * the next time it signs in. The alternative is the grant script against
   * D1; this is for the deploy that has no one to run it yet.
   */
  ADMIN_EMAILS?: string;
  TURNSTILE_SECRET_KEY?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  /**
   * Sign in with Apple. The "secret" is the signed JWT Apple has you mint
   * from your key, which expires every six months - rotate it like any
   * other secret.
   */
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;

  /** Set only in .dev.vars. Relaxes cookie flags and opens CORS to :3000. */
  DEV?: string;
};

export const isDev = (env: Env) => env.DEV === '1';
