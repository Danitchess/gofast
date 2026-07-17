import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sql, DB_CONFIGURED } from '@/lib/db';
import { confirmQuote } from '@/lib/actions/quoteActions';
import { formatDate } from '@/lib/format';

export const metadata = { title: 'Confirmer votre devis' };
export const dynamic = 'force-dynamic';

export default async function QuoteActionPage({ params }) {
  const { token, action } = params;
  if (!['accepter', 'refuser'].includes(action)) notFound();

  if (!DB_CONFIGURED) {
    return (
      <Notice title="Service indisponible">
        Le suivi des devis n&apos;est pas encore configuré. Merci de contacter Go Fast Logistics directement au +32 (0)2 385 34 30.
      </Notice>
    );
  }

  const [quote] = await sql`select q.*, v.name as vehicle_name from quotes q left join vehicles v on v.id = q.vehicle_id where q.token = ${token}`;

  if (!quote) {
    return <Notice title="Lien invalide">Ce lien de devis n&apos;existe pas ou plus.</Notice>;
  }
  if (quote.status !== 'quoted') {
    return (
      <Notice title="Devis déjà traité">
        Ce devis a déjà été {quote.status === 'accepted' ? 'accepté' : quote.status === 'declined' ? 'refusé' : 'traité'}. Contactez-nous si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
      </Notice>
    );
  }

  const isAccept = action === 'accepter';

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="form-card">
          <h1 style={{ fontSize: '1.4rem', marginBottom: 6 }}>
            {isAccept ? 'Accepter ce devis ?' : 'Refuser ce devis ?'}
          </h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: 20, fontSize: '0.92rem' }}>
            Merci de confirmer votre choix — cette action est définitive.
          </p>

          <div className="summary-box">
            <div className="summary-row"><span>Type de transport</span><span>{quote.transport_type}</span></div>
            <div className="summary-row"><span>Véhicule</span><span>{quote.vehicle_name || 'Non précisé'}</span></div>
            <div className="summary-row"><span>Trajet</span><span>{quote.pickup_city} → {quote.dropoff_city}</span></div>
            <div className="summary-row"><span>Date</span><span>{formatDate(quote.transport_date)} à {quote.transport_time}</span></div>
            <div className="summary-row"><span>Montant du devis</span><span>{quote.price_eur} €</span></div>
          </div>

          <form action={confirmQuote} style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="action" value={action} />
            <Link href="/" className="btn btn-dark">Annuler</Link>
            <button type="submit" className={isAccept ? 'btn btn-primary' : 'btn btn-outline'} style={!isAccept ? { color: 'var(--black)', borderColor: 'var(--black)' } : undefined}>
              {isAccept ? 'Oui, accepter le devis' : 'Oui, refuser le devis'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Notice({ title, children }) {
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.4rem', marginBottom: 12 }}>{title}</h1>
        <p style={{ color: 'var(--gray-600)' }}>{children}</p>
        <Link href="/" className="btn btn-dark" style={{ marginTop: 24, display: 'inline-flex' }}>Retour à l&apos;accueil</Link>
      </div>
    </section>
  );
}
