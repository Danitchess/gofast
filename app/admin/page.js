import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sql, DB_CONFIGURED } from '@/lib/db';
import { ADMIN_COOKIE, isValidSession } from '@/lib/adminAuth';
import { sendQuote, logoutAdmin } from '@/lib/actions/adminActions';
import { formatDate } from '@/lib/format';

export const metadata = { title: 'Espace employé' };
export const dynamic = 'force-dynamic';

const STATUS_LABELS = {
  new: 'Nouvelle demande',
  quoted: 'Devis envoyé — en attente du client',
  accepted: 'Accepté',
  declined: 'Refusé',
};

export default async function AdminPage({ searchParams }) {
  const session = cookies().get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    redirect('/admin/login');
  }

  if (!DB_CONFIGURED) {
    return (
      <section className="section">
        <div className="container">
          <p style={{ background: '#fdecea', color: '#a5000f', padding: 16, borderRadius: 8 }}>
            DATABASE_URL n&apos;est pas configuré — l&apos;espace employé nécessite une base Neon. Voir <code>db/schema.sql</code> et <code>.env.example</code>.
          </p>
        </div>
      </section>
    );
  }

  const [quotes, vehicles] = await Promise.all([
    sql`select q.*, v.name as vehicle_name from quotes q left join vehicles v on v.id = q.vehicle_id order by q.created_at desc limit 50`,
    sql`select id, name, available_units, total_units from vehicles order by name`,
  ]);

  const pending = quotes.filter((q) => q.status === 'new');
  const awaiting = quotes.filter((q) => q.status === 'quoted');
  const recent = quotes.filter((q) => ['accepted', 'declined'].includes(q.status)).slice(0, 10);

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: '1.6rem' }}>Espace employé</h1>
          <form action={logoutAdmin}>
            <button type="submit" className="btn btn-dark">Se déconnecter</button>
          </form>
        </div>

        {searchParams?.sent === '1' && (
          <p style={{ background: '#e8f8ee', color: '#16a34a', padding: 12, borderRadius: 8, marginBottom: 20 }}>Devis envoyé au client.</p>
        )}
        {searchParams?.error && (
          <p style={{ background: '#fdecea', color: '#a5000f', padding: 12, borderRadius: 8, marginBottom: 20 }}>
            {searchParams.error === 'already-processed' ? 'Ce devis a déjà été traité.' : 'Prix invalide.'}
          </p>
        )}

        <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Nouvelles demandes ({pending.length})</h2>
        <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
          {pending.length === 0 && <p style={{ color: 'var(--gray-600)' }}>Aucune nouvelle demande.</p>}
          {pending.map((q) => (
            <div key={q.id} className="form-card">
              <QuoteSummary q={q} />
              <form action={sendQuote} style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <input type="hidden" name="id" value={q.id} />
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label>Prix du devis (€)</label>
                  <input type="number" name="priceEur" min="1" step="0.01" required style={{ width: 160 }} />
                </div>
                <button type="submit" className="btn btn-primary">Envoyer le devis</button>
              </form>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>En attente de réponse client ({awaiting.length})</h2>
        <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
          {awaiting.length === 0 && <p style={{ color: 'var(--gray-600)' }}>Aucun devis en attente.</p>}
          {awaiting.map((q) => (
            <div key={q.id} className="form-card">
              <QuoteSummary q={q} />
              <p style={{ marginTop: 10, fontWeight: 700 }}>Devis envoyé : {q.price_eur} €</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Réponses récentes</h2>
        <div style={{ display: 'grid', gap: 12, marginBottom: 40 }}>
          {recent.length === 0 && <p style={{ color: 'var(--gray-600)' }}>Aucune réponse pour le moment.</p>}
          {recent.map((q) => (
            <div key={q.id} className="summary-row" style={{ background: 'var(--gray-100)', padding: '10px 16px', borderRadius: 8 }}>
              <span>{q.customer_name} — {q.vehicle_name}</span>
              <span style={{ color: q.status === 'accepted' ? '#16a34a' : 'var(--red)' }}>{STATUS_LABELS[q.status]}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Disponibilité de la flotte</h2>
        <div className="grid-4">
          {vehicles.map((v) => (
            <div key={v.id} className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.95rem' }}>{v.name}</h3>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 6, color: v.available_units === 0 ? 'var(--red)' : v.available_units === 1 ? '#d97706' : 'var(--black)' }}>
                {v.available_units} / {v.total_units}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSummary({ q }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <strong>{q.customer_name}</strong>
        <span style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>{new Date(q.created_at).toLocaleString('fr-BE')}</span>
      </div>
      <div className="summary-box" style={{ marginTop: 12, marginBottom: 0 }}>
        <div className="summary-row"><span>Type</span><span>{q.transport_type}</span></div>
        <div className="summary-row"><span>Véhicule</span><span>{q.vehicle_name || 'Non précisé'}</span></div>
        <div className="summary-row"><span>Trajet</span><span>{q.pickup_city} ({q.pickup_country}) → {q.dropoff_city} ({q.dropoff_country})</span></div>
        <div className="summary-row"><span>Date</span><span>{formatDate(q.transport_date)} à {q.transport_time}</span></div>
        <div className="summary-row"><span>Contact</span><span>{q.customer_email} · {q.customer_phone}</span></div>
        {q.notes && <div className="summary-row"><span>Remarques</span><span>{q.notes}</span></div>}
      </div>
    </div>
  );
}
