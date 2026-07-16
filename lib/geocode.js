// Shared Nominatim (OpenStreetMap) lookup — used by the autocomplete API
// route and by server-side validation, so a request can never bypass the
// client-side check by hitting /api/reservations directly.
export async function searchCity(query, countryCode) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    addressdetails: '1',
    limit: '5',
    featureType: 'city',
  });
  if (countryCode) params.set('countrycodes', countryCode.toLowerCase());

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: {
      'User-Agent': 'GoFastLogistics-Website/1.0 (info@gofasttransport.be)',
      'Accept-Language': 'fr',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data
    .map((item) => ({
      label: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || item.name,
      country: item.address?.country,
      countryCode: item.address?.country_code?.toUpperCase(),
    }))
    .filter((r) => r.city);
}

function normalize(str) {
  return (str || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export async function verifyCity(city, countryCode) {
  try {
    const results = await searchCity(city, countryCode);
    return results.some((r) => normalize(r.city) === normalize(city));
  } catch {
    // Nominatim hiccup: don't block a legitimate booking over a network blip.
    return true;
  }
}
