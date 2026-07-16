import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'gfl_admin_session';
const SECRET = process.env.ADMIN_SESSION_SECRET || 'dev-insecure-secret-change-me';

export const ADMIN_CONFIGURED = Boolean(process.env.ADMIN_PASSWORD);

export function makeSessionToken() {
  return createHmac('sha256', SECRET).update(process.env.ADMIN_PASSWORD || '').digest('hex');
}

export function isValidSession(token) {
  if (!token || !ADMIN_CONFIGURED) return false;
  const expected = makeSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
