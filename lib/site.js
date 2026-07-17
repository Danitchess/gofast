// Vercel injects VERCEL_URL automatically at build/runtime (no config
// needed), including on preview deployments where the URL changes on every
// deploy. SITE_URL lets you pin a stable custom domain when you have one;
// without it, links in emails still work correctly on preview and prod.
export function getSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
