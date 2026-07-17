// The Neon driver parses Postgres `date`/`timestamp` columns into native JS
// Date objects, which React refuses to render directly as children. This
// normalizes any date-like value (Date object or 'YYYY-MM-DD' string) into
// a display string.
export function formatDate(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  // Date-only Postgres values parse to UTC midnight — read UTC fields so the
  // calendar day doesn't shift in timezones behind UTC.
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
