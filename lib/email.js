import { Resend } from 'resend';

const EMAIL_CONFIGURED = Boolean(process.env.RESEND_API_KEY);
const resend = EMAIL_CONFIGURED ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM || 'Go Fast Logistics <onboarding@resend.dev>';
export const COMPANY_INBOX = process.env.COMPANY_INBOX || 'danikhalife12@gmail.com';

// Demo mode: no RESEND_API_KEY set → emails are logged instead of sent, so
// the whole quote flow stays testable without a Resend account.
export async function sendEmail({ to, subject, html }) {
  if (!EMAIL_CONFIGURED) {
    console.log(`\n[DEMO MODE — email not sent, RESEND_API_KEY missing]\nTo: ${to}\nSubject: ${subject}\n${html}\n`);
    return { demo: true };
  }

  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });

  // The Resend SDK returns { error } instead of throwing — without this
  // check a rejected send (e.g. sandbox mode blocking the recipient) looks
  // identical to a successful one.
  if (error) {
    console.error(`[Resend] Failed to send "${subject}" to ${to}:`, error);
    throw new Error(`Resend error sending to ${to}: ${error.message || JSON.stringify(error)}`);
  }

  return data;
}
