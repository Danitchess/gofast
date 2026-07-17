import { sql, DB_CONFIGURED } from '@/lib/db';
import { VEHICLE_MAP } from '@/lib/vehicles';
import { checkBusinessHours, isDateInPast } from '@/lib/businessHours';
import { sendEmail, COMPANY_INBOX } from '@/lib/email';
import { newQuoteRequestEmail, customerAckEmail } from '@/lib/emailTemplates';
import { verifyCity } from '@/lib/geocode';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = {};
  if (!body.transportType) errors.transportType = 'Type de transport requis.';
  if (!body.pickupCity || !body.pickupCountry) errors.pickup = 'Adresse de départ incomplète.';
  if (!body.dropoffCity || !body.dropoffCountry) errors.dropoff = "Adresse d'arrivée incomplète.";
  if (!body.date) errors.date = 'Date requise.';
  else if (isDateInPast(body.date)) errors.date = 'La date ne peut pas être dans le passé.';
  if (!body.time) errors.time = 'Heure requise.';
  if (body.date && body.time) {
    const bh = checkBusinessHours(body.date, body.time);
    if (!bh.valid) errors.time = bh.reason;
  }
  if (body.weightKg !== '' && body.weightKg != null && (Number(body.weightKg) <= 0 || Number(body.weightKg) > 30000)) {
    errors.weightKg = 'Poids estimé invalide (entre 1 et 30 000 kg).';
  }
  if (body.volumeM3 !== '' && body.volumeM3 != null && (Number(body.volumeM3) <= 0 || Number(body.volumeM3) > 100)) {
    errors.volumeM3 = 'Volume estimé invalide (entre 0.1 et 100 m³).';
  }
  if (body.vehicle && VEHICLE_MAP[body.vehicle]) {
    const v = VEHICLE_MAP[body.vehicle];
    if (body.weightKg && Number(body.weightKg) > v.maxWeightKg) {
      errors.weightKg = `Le poids dépasse la capacité de ce véhicule (max ${v.maxWeightKg} kg). Choisissez un véhicule plus grand.`;
    }
    if (body.volumeM3 && Number(body.volumeM3) > v.volumeM3) {
      errors.volumeM3 = `Le volume dépasse la capacité de ce véhicule (max ${v.volumeM3} m³). Choisissez un véhicule plus grand.`;
    }
  }
  if (!body.name) errors.name = 'Nom requis.';
  if (!body.email || !EMAIL_RE.test(body.email)) errors.email = 'Email invalide.';
  if (!body.phone) errors.phone = 'Téléphone requis.';
  return errors;
}

export async function POST(request) {
  const body = await request.json();
  const errors = validate(body);

  if (Object.keys(errors).length === 0) {
    const [pickupOk, dropoffOk] = await Promise.all([
      verifyCity(body.pickupCity, body.pickupCountry),
      verifyCity(body.dropoffCity, body.dropoffCountry),
    ]);
    if (!pickupOk) errors.pickup = "Cette ville de départ n'a pas été trouvée.";
    if (!dropoffOk) errors.dropoff = "Cette ville d'arrivée n'a pas été trouvée.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  const vehicle = VEHICLE_MAP[body.vehicle];
  const quote = {
    transport_type: body.transportType,
    vehicle_name: vehicle?.name || 'À déterminer',
    pickup_city: body.pickupCity,
    pickup_country: body.pickupCountry,
    dropoff_city: body.dropoffCity,
    dropoff_country: body.dropoffCountry,
    transport_date: body.date,
    transport_time: body.time,
    weight_kg: body.weightKg || null,
    volume_m3: body.volumeM3 || null,
    customer_name: body.name,
    customer_email: body.email,
    customer_phone: body.phone,
    notes: body.notes || null,
  };

  let quoteId = null;

  if (DB_CONFIGURED) {
    try {
      // Reject if the requested vehicle type is entirely out of stock.
      if (body.vehicle) {
        const [row] = await sql`select available_units from vehicles where id = ${body.vehicle}`;
        if (row && row.available_units <= 0) {
          return Response.json({ ok: false, errors: { vehicle: 'Ce véhicule est actuellement indisponible. Merci de choisir un autre modèle.' } }, { status: 409 });
        }
      }

      const [inserted] = await sql`
        insert into quotes (
          status, transport_type, vehicle_id, pickup_city, pickup_country,
          dropoff_city, dropoff_country, transport_date, transport_time,
          weight_kg, volume_m3, customer_name, customer_email, customer_phone, notes
        ) values (
          'new', ${body.transportType}, ${body.vehicle || null}, ${body.pickupCity}, ${body.pickupCountry},
          ${body.dropoffCity}, ${body.dropoffCountry}, ${body.date}, ${body.time},
          ${body.weightKg || null}, ${body.volumeM3 || null}, ${body.name}, ${body.email}, ${body.phone}, ${body.notes || null}
        )
        returning id`;
      quoteId = inserted.id;
    } catch (err) {
      console.error('Failed to persist quote', err);
    }
  }

  // Sent independently: a failure on one (e.g. Resend sandbox rejecting the
  // company inbox) must not prevent the other from going out.
  const req1 = newQuoteRequestEmail(quote);
  const req2 = customerAckEmail(quote);
  const results = await Promise.allSettled([
    sendEmail({ to: COMPANY_INBOX, subject: req1.subject, html: req1.html }),
    sendEmail({ to: body.email, subject: req2.subject, html: req2.html }),
  ]);
  if (results[0].status === 'rejected') console.error('Failed to notify company inbox', results[0].reason);
  if (results[1].status === 'rejected') console.error('Failed to send customer acknowledgement', results[1].reason);

  return Response.json({ ok: true, quoteId, demo: !DB_CONFIGURED });
}
