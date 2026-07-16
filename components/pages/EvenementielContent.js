'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { useT } from '@/lib/i18n';

export default function EvenementielContent() {
  const t = useT();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.breadcrumbHome')}</Link> / {t('common.nav.events')}</div>
          <h1>{t('events.hero.title')}</h1>
          <p>{t('events.hero.text')}</p>
          <div style={{ marginTop: 28 }}><Link href="/reservation" className="btn btn-primary">{t('events.hero.cta')}</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('events.what.eyebrow')}</span>
            <h2>{t('events.what.title')}</h2>
          </Reveal>
          <div className="grid-4">
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-6h6v6" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('events.what.c1')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('events.what.c1h')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('events.what.c2')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('events.what.c2h')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="1" /><path d="M3 10h18M8 4v6" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('events.what.c3')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('events.what.c3h')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5-9 9" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('events.what.c4')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('events.what.c4h')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container grid-2" style={{ gap: 60, alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">{t('events.commitment.eyebrow')}</span>
            <h2>{t('events.commitment.title')}</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 16 }}>{t('events.commitment.text')}</p>
            <div style={{ marginTop: 26 }}><Link href="/reservation" className="btn btn-dark">{t('events.commitment.cta')}</Link></div>
          </Reveal>
          <Reveal>
            <div className="feature-row">
              <div className="feature-num">01</div>
              <div><h4>{t('events.commitment.f1Title')}</h4><p>{t('events.commitment.f1Text')}</p></div>
            </div>
            <div className="feature-row">
              <div className="feature-num">02</div>
              <div><h4>{t('events.commitment.f2Title')}</h4><p>{t('events.commitment.f2Text')}</p></div>
            </div>
            <div className="feature-row">
              <div className="feature-num">03</div>
              <div><h4>{t('events.commitment.f3Title')}</h4><p>{t('events.commitment.f3Text')}</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="cta-banner">
            <div>
              <h2>{t('events.cta.title')}</h2>
              <p>{t('events.cta.text')}</p>
            </div>
            <div className="cta-banner-actions">
              <Link href="/reservation" className="btn btn-primary">{t('events.cta.book')}</Link>
              <Link href="/contact" className="btn btn-outline">{t('events.cta.contact')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
