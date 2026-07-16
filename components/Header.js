'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale, useT, LOCALES } from '@/lib/i18n';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = useT();

  const NAV_LINKS = [
    { href: '/', label: t('common.nav.home') },
    { href: '/flotte', label: t('common.nav.fleet') },
    { href: '/logistique', label: t('common.nav.logistics') },
    { href: '/evenementiel', label: t('common.nav.events') },
    { href: '/partenaires', label: t('common.nav.partners') },
    { href: '/contact', label: t('common.nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar-contacts">
            <a href="tel:+3223853430">📞 +32 (0)2 385 34 30</a>
            <a href="mailto:info@gofasttransport.be" className="hide-sm">✉️ info@gofasttransport.be</a>
            <span className="hide-sm">{t('common.topbar.location')}</span>
          </div>
          <div className="lang-switch">
            {LOCALES.map((l, i) => (
              <span key={l.code} style={{ display: 'contents' }}>
                <button className={locale === l.code ? 'active' : ''} onClick={() => setLocale(l.code)}>{l.label}</button>
                {i < LOCALES.length - 1 && <span>|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav">
          <Link href="/" className="logo">
            <span className="logo-mark"><span>GF</span></span>
            <span>GO FAST<small>Logistics</small></span>
          </Link>

          <nav className={`nav-links${mobileOpen ? ' mobile-open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-cta">
            <Link href="/contact" className="btn btn-dark">{t('common.cta.contact')}</Link>
            <Link href="/reservation" className="btn btn-primary">{t('common.cta.book')}</Link>
          </div>

          <button
            className={`burger${mobileOpen ? ' open' : ''}`}
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    </>
  );
}
