import { formatDate } from './format';

const wrap = (title, bodyHtml) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f5;padding:32px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d8d8db;">
    <div style="background:#0b0b0c;padding:22px 28px;">
      <span style="color:#ffffff;font-weight:800;font-size:1.1rem;">GO FAST <span style="color:#ff3b4e;">LOGISTICS</span></span>
    </div>
    <div style="padding:28px;">
      <h2 style="color:#0b0b0c;margin:0 0 16px;">${title}</h2>
      ${bodyHtml}
    </div>
    <div style="padding:18px 28px;background:#f4f4f5;color:#6b6b70;font-size:12px;">
      Go Fast Logistics — Rue du Try 164, 1421 Ophain — BE0567589659
    </div>
  </div>
</div>`;

const row = (label, value) =>
  value ? `<tr><td style="padding:6px 0;color:#6b6b70;font-size:13px;">${label}</td><td style="padding:6px 0;font-weight:700;font-size:13px;text-align:right;">${value}</td></tr>` : '';

function quoteDetailsTable(q) {
  return `<table style="width:100%;border-collapse:collapse;margin:14px 0;">
    ${row('Type de transport', q.transport_type)}
    ${row('Véhicule', q.vehicle_name)}
    ${row('Départ', `${q.pickup_city}, ${q.pickup_country}`)}
    ${row('Arrivée', `${q.dropoff_city}, ${q.dropoff_country}`)}
    ${row('Date', `${formatDate(q.transport_date)} à ${q.transport_time}`)}
    ${row('Poids estimé', q.weight_kg ? `${q.weight_kg} kg` : null)}
    ${row('Volume estimé', q.volume_m3 ? `${q.volume_m3} m³` : null)}
    ${row('Client', `${q.customer_name} (${q.customer_email}, ${q.customer_phone})`)}
    ${row('Remarques', q.notes)}
  </table>`;
}

export function newQuoteRequestEmail(q) {
  return {
    subject: `Nouvelle demande de devis — ${q.customer_name}`,
    html: wrap('Nouvelle demande de devis', `
      <p>Une nouvelle demande de réservation vient d'arriver depuis le site.</p>
      ${quoteDetailsTable(q)}
      <p style="margin-top:20px;">Rendez-vous sur l'espace employé pour envoyer un devis chiffré au client.</p>
      <a href="${process.env.SITE_URL || 'http://localhost:3000'}/admin" style="display:inline-block;background:#e2001a;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:700;">Ouvrir l'espace employé</a>
    `),
  };
}

export function customerAckEmail(q) {
  return {
    subject: 'Nous avons bien reçu votre demande — Go Fast Logistics',
    html: wrap('Demande reçue !', `
      <p>Bonjour ${q.customer_name},</p>
      <p>Merci pour votre demande de transport. Notre équipe l'analyse et vous enverra un devis détaillé sous 2h ouvrées.</p>
      ${quoteDetailsTable(q)}
    `),
  };
}

export function quoteOfferEmail(q, acceptUrl, declineUrl) {
  return {
    subject: `Votre devis Go Fast Logistics — ${q.price_eur} €`,
    html: wrap('Votre devis est prêt', `
      <p>Bonjour ${q.customer_name},</p>
      <p>Voici le devis pour votre transport :</p>
      ${quoteDetailsTable(q)}
      <p style="font-size:1.3rem;font-weight:800;margin:18px 0;">Montant : ${q.price_eur} €</p>
      <div style="display:flex;gap:12px;margin-top:22px;">
        <a href="${acceptUrl}" style="display:inline-block;background:#e2001a;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;margin-right:10px;">✓ Accepter le devis</a>
        <a href="${declineUrl}" style="display:inline-block;background:transparent;color:#0b0b0c;border:2px solid #0b0b0c;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:700;">✕ Refuser le devis</a>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#6b6b70;">Une page de confirmation vous sera présentée avant validation définitive.</p>
    `),
  };
}

export function customerResponseNotificationEmail(q, accepted) {
  return {
    subject: `Devis ${accepted ? 'accepté' : 'refusé'} — ${q.customer_name}`,
    html: wrap(`Le client a ${accepted ? 'accepté' : 'refusé'} le devis`, `
      ${quoteDetailsTable(q)}
      <p style="margin-top:16px;font-weight:700;color:${accepted ? '#16a34a' : '#e2001a'};">
        ${accepted ? `Devis accepté — le véhicule ${q.vehicle_name} a été décompté du stock disponible.` : 'Devis refusé par le client.'}
      </p>
    `),
  };
}
