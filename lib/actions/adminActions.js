'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sql, DB_CONFIGURED } from '@/lib/db';
import { ADMIN_COOKIE, ADMIN_CONFIGURED, makeSessionToken, isValidSession } from '@/lib/adminAuth';
import { sendEmail } from '@/lib/email';
import { quoteOfferEmail } from '@/lib/emailTemplates';

export async function loginAdmin(formData) {
  const password = formData.get('password');

  if (!ADMIN_CONFIGURED) {
    redirect('/admin/login?error=not-configured');
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login?error=invalid');
  }

  cookies().set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  redirect('/admin');
}

export async function logoutAdmin() {
  cookies().delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

async function requireAdmin() {
  const session = cookies().get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    redirect('/admin/login');
  }
}

export async function sendQuote(formData) {
  await requireAdmin();

  const id = formData.get('id');
  const priceEur = Number(formData.get('priceEur'));
  if (!id || !priceEur || priceEur <= 0) {
    redirect('/admin?error=invalid-price');
  }
  if (!DB_CONFIGURED) {
    redirect('/admin');
  }

  const [quote] = await sql`
    update quotes
    set status = 'quoted', price_eur = ${priceEur}, quoted_at = now()
    where id = ${id} and status = 'new'
    returning *, (select name from vehicles where id = quotes.vehicle_id) as vehicle_name`;

  if (!quote) {
    redirect('/admin?error=already-processed');
  }

  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const acceptUrl = `${siteUrl}/devis/${quote.token}/accepter`;
  const declineUrl = `${siteUrl}/devis/${quote.token}/refuser`;

  try {
    const offer = quoteOfferEmail(quote, acceptUrl, declineUrl);
    await sendEmail({ to: quote.customer_email, subject: offer.subject, html: offer.html });
  } catch (err) {
    console.error('Failed to send quote offer email', err);
  }

  redirect('/admin?sent=1');
}
