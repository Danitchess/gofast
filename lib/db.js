import { neon } from '@neondatabase/serverless';

export const DB_CONFIGURED = Boolean(process.env.DATABASE_URL);

// In demo mode (no DATABASE_URL set) every function below no-ops or returns
// sensible defaults so the site keeps working end-to-end without a database.
// Set DATABASE_URL (a Neon connection string) in .env.local to go live —
// see /db/schema.sql for the tables to create first.
export const sql = DB_CONFIGURED ? neon(process.env.DATABASE_URL) : null;

export function requireDb() {
  if (!DB_CONFIGURED) {
    throw new Error('DATABASE_URL is not configured — running in demo mode.');
  }
  return sql;
}
