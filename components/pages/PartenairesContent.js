'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { useT } from '@/lib/i18n';

export default function PartenairesContent() {
  const t = useT();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.breadcrumbHome')}</Link> / {t('common.nav.partners')}</div>
          <h1>{t('partners.hero.title')}</h1>
          <p>{t('partners.hero.text')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('partners.trust.eyebrow')}</span>
            <h2>{t('partners.trust.title')}</h2>
            <p>{t('partners.trust.text')}</p>
          </Reveal>
          <div className="grid-3">
            <Reveal className="card">
              <div className="card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="15" height="12" rx="1" /><path d="M16 10h4l3 3v5h-7" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg></div>
              <h3>{t('partners.trust.c1Title')}</h3>
              <p>{t('partners.trust.c1Text')}</p>
            </Reveal>
            <Reveal className="card">
              <div className="card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /></svg></div>
              <h3>{t('partners.trust.c2Title')}</h3>
              <p>{t('partners.trust.c2Text')}</p>
            </Reveal>
            <Reveal className="card">
              <div className="card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" /></svg></div>
              <h3>{t('partners.trust.c3Title')}</h3>
              <p>{t('partners.trust.c3Text')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('partners.sectors.eyebrow')}</span>
            <h2>{t('partners.sectors.title')}</h2>
          </Reveal>
          <div className="grid-4">
            <Reveal className="partner-logo">{t('partners.sectors.s1')}</Reveal>
            <Reveal className="partner-logo">{t('partners.sectors.s2')}</Reveal>
            <Reveal className="partner-logo">{t('partners.sectors.s3')}</Reveal>
            <Reveal className="partner-logo">{t('partners.sectors.s4')}</Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="cta-banner">
            <div>
              <h2>{t('partners.cta.title')}</h2>
              <p>{t('partners.cta.text')}</p>
            </div>
            <div className="cta-banner-actions">
              <Link href="/contact" className="btn btn-primary">{t('partners.cta.contact')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
