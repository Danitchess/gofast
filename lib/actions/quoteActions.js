'use server';

import { redirect } from 'next/navigation';
import { sql, DB_CONFIGURED } from '@/lib/db';
import { sendEmail, COMPANY_INBOX } from '@/lib/email';
import { customerResponseNotificationEmail } from '@/lib/emailTemplates';

export async function confirmQuote(formData) {
  const token = formData.get('token');
  const action = formData.get('action'); // 'accepter' | 'refuser'

  if (!DB_CONFIGURED || !token || !['accepter', 'refuser'].includes(action)) {
    redirect(`/devis/confirme?result=error`);
  }

  const newStatus = action === 'accepter' ? 'accepted' : 'declined';

  // Atomic claim: only succeeds if the quote is still awaiting a response,
  // so double-clicks or reused links can't process the same quote twice.
  const [quote] = await sql`
    update quotes
    set status = ${newStatus}, responded_at = now()
    where token = ${token} and status = 'quoted'
    returning *`;

  if (!quote) {
    redirect(`/devis/confirme?result=already-handled`);
  }

  let vehicleName = null;
  if (newStatus === 'accepted' && quote.vehicle_id) {
    const [v] = await sql`
      update vehicles
      set available_units = greatest(available_units - 1, 0)
      where id = ${quote.vehicle_id}
      returning name`;
    vehicleName = v?.name;
  }

  try {
    const notif = customerResponseNotificationEmail({ ...quote, vehicle_name: vehicleName }, newStatus === 'accepted');
    await sendEmail({ to: COMPANY_INBOX, subject: notif.subject, html: notif.html });
  } catch (err) {
    console.error('Failed to notify employees of quote response', err);
  }

  redirect(`/devis/confirme?result=ok&action=${action}`);
}
