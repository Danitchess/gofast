import { searchCity } from '@/lib/geocode';

// Thin proxy over OpenStreetMap Nominatim so requests carry a proper
// identifying User-Agent (required by Nominatim's usage policy) and so the
// lookup logic stays server-side only. No account/API key needed.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const countryCode = searchParams.get('country')?.trim();

  try {
    const results = await searchCity(q, countryCode);
    return Response.json({ results });
  } catch {
    return Response.json({ results: [] });
  }
}
