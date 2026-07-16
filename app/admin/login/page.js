import { loginAdmin } from '@/lib/actions/adminActions';
import { ADMIN_CONFIGURED } from '@/lib/adminAuth';

export const metadata = { title: 'Espace employé — Connexion' };

const ERROR_MESSAGES = {
  invalid: 'Mot de passe incorrect.',
  'not-configured': "ADMIN_PASSWORD n'est pas configuré côté serveur — voir le fichier .env.example.",
};

export default function AdminLoginPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="form-card">
          <h1 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Espace employé</h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.92rem' }}>Connectez-vous pour traiter les demandes de devis.</p>

          {!ADMIN_CONFIGURED && (
            <p style={{ background: '#fdecea', color: '#a5000f', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 18 }}>
              ADMIN_PASSWORD n&apos;est pas configuré côté serveur. Ajoutez-le dans <code>.env.local</code> (voir <code>.env.example</code>).
            </p>
          )}
          {error && ERROR_MESSAGES[error] && (
            <p style={{ background: '#fdecea', color: '#a5000f', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 18 }}>
              {ERROR_MESSAGES[error]}
            </p>
          )}

          <form action={loginAdmin}>
            <div className="field-group">
              <label htmlFor="password">Mot de passe</label>
              <input type="password" id="password" name="password" required autoFocus />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
          </form>
        </div>
      </div>
    </section>
  );
}
