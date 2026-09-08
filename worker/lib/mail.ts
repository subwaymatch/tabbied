import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import { devMail } from '../db/schema';
import type { Env } from '../env';
import { isDev } from '../env';

// Transactional mail, behind one function so better-auth's hooks never learn
// which provider is in use.
//
// With no RESEND_API_KEY *in development* the message is written to the
// dev_mail table instead of sent. That is not a stub for its own sake: it is
// how the e2e flow reads a verification link back without a mail provider, and
// how a developer confirms an account offline. It is confined to that one path,
// so production either sends or fails loudly.
//
//   npx wrangler d1 execute tabbied --local \
//     --command "SELECT url FROM dev_mail WHERE email = 'you@example.com'"

export type Mail = { to: string; subject: string; url: string; text: string };

export async function sendMail(env: Env, mail: Mail): Promise<void> {
  if (!env.RESEND_API_KEY) {
    if (!isDev(env)) {
      // Production with no provider is a misconfiguration, not a fallback: a
      // silently-swallowed verification mail strands the account.
      throw new Error('RESEND_API_KEY is not set');
    }

    const db = drizzle(env.DB, { schema });
    const email = mail.to.toLowerCase();

    // One row per address: the newest link is the only one worth having, and
    // an unbounded log of dev mail is just litter in the dev database.
    await db
      .insert(devMail)
      .values({
        email,
        subject: mail.subject,
        url: mail.url,
        body: mail.text,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: devMail.email,
        set: { subject: mail.subject, url: mail.url, body: mail.text },
      });
    console.log(`[mail:dev] ${mail.subject} -> ${mail.to}\n  ${mail.url}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Tabbied <hello@tabbied.com>',
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`mail send failed: ${response.status}`);
  }
}
