'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';

export default function Footer() {
  const t = useT();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="logo">
              <span className="logo-mark"><span>GF</span></span>
              <span>GO FAST<small>Logistics</small></span>
            </Link>
            <p>{t('common.footer.tagline')}</p>
            <div className="social-row">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Instagram">ig</a>
            </div>
          </div>
          <div>
            <h4>{t('common.footer.navTitle')}</h4>
            <ul>
              <li><Link href="/flotte">{t('common.nav.fleet')}</Link></li>
              <li><Link href="/logistique">{t('common.nav.logistics')}</Link></li>
              <li><Link href="/evenementiel">{t('common.nav.events')}</Link></li>
              <li><Link href="/partenaires">{t('common.nav.partners')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('common.footer.servicesTitle')}</h4>
            <ul>
              <li><Link href="/reservation">{t('common.footer.serviceBook')}</Link></li>
              <li><Link href="/logistique">{t('common.footer.serviceStorage')}</Link></li>
              <li><Link href="/evenementiel">{t('common.footer.serviceEvents')}</Link></li>
              <li><Link href="/contact">{t('common.footer.serviceQuote')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('common.footer.contactTitle')}</h4>
            <ul className="footer-contact">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>
                +32 (0)2 385 34 30
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
                info@gofasttransport.be
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Rue du Try 164, 1421 Ophain
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('common.footer.copyright')}</span>
          <div className="footer-legal">
            <a href="#">{t('common.footer.terms')}</a>
            <a href="#">{t('common.footer.legal')}</a>
            <a href="#">{t('common.footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
