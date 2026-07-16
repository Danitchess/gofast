import { resolveMx } from 'node:dns/promises';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checks the email's domain actually has mail servers configured.
// This does NOT confirm the mailbox itself exists (that needs an SMTP
// handshake or a paid verification API) — it's a solid, free first filter
// against typos and made-up domains.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.trim() || '';

  if (!EMAIL_RE.test(email)) {
    return Response.json({ valid: false, reason: "Format d'email invalide." });
  }

  const domain = email.split('@')[1];

  try {
    const records = await resolveMx(domain);
    if (records && records.length > 0) {
      return Response.json({ valid: true });
    }
    return Response.json({ valid: false, reason: "Ce domaine n'accepte pas d'emails." });
  } catch {
    return Response.json({ valid: false, reason: "Ce domaine ne semble pas exister." });
  }
}
