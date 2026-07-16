import Link from 'next/link';

export const metadata = { title: 'Confirmation' };

const MESSAGES = {
  ok: {
    accepter: { title: 'Devis accepté !', body: 'Merci, notre équipe organise votre transport. Vous recevrez une confirmation détaillée sous peu.' },
    refuser: { title: 'Devis refusé', body: "C'est noté. N'hésitez pas à nous recontacter si vos besoins évoluent." },
  },
  'already-handled': { title: 'Devis déjà traité', body: 'Ce devis a déjà reçu une réponse.' },
  error: { title: 'Une erreur est survenue', body: 'Merci de réessayer ou de nous contacter directement.' },
};

export default function QuoteConfirmedPage({ searchParams }) {
  const result = searchParams?.result || 'error';
  const action = searchParams?.action;
  const msg = result === 'ok' ? MESSAGES.ok[action] : MESSAGES[result] || MESSAGES.error;

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="success-box">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={{ fontSize: '1.4rem' }}>{msg.title}</h1>
          <p style={{ color: 'var(--gray-600)', marginTop: 10 }}>{msg.body}</p>
          <Link href="/" className="btn btn-dark" style={{ marginTop: 26 }}>Retour à l&apos;accueil</Link>
        </div>
      </div>
    </section>
  );
}
