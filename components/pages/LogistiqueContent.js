'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';
import { useT } from '@/lib/i18n';

export default function LogistiqueContent() {
  const t = useT();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.breadcrumbHome')}</Link> / {t('common.nav.logistics')}</div>
          <h1>{t('logistics.hero.title')}</h1>
          <p>{t('logistics.hero.text')}</p>
          <div style={{ marginTop: 28 }}><Link href="/reservation" className="btn btn-primary">{t('logistics.hero.cta')}</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2" style={{ gap: 60, alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">{t('logistics.storage.eyebrow')}</span>
            <h2>{t('logistics.storage.title')}</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 16 }}>{t('logistics.storage.text')}</p>
          </Reveal>
          <Reveal className="grid-2">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}><Counter value={2000} suffix=" m²" /></div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: 6 }}>{t('logistics.storage.statArea')}</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}><Counter value={24} suffix="/7" /></div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: 6 }}>{t('logistics.storage.statAccess')}</div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('logistics.equipment.eyebrow')}</span>
            <h2>{t('logistics.equipment.title')}</h2>
            <p>{t('logistics.equipment.text')}</p>
          </Reveal>
          <div className="grid-4">
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('logistics.equipment.e1')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('logistics.equipment.e1h')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M6 21V9l6-6 6 6v12" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('logistics.equipment.e2')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('logistics.equipment.e2h')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M6 20V8l4-4 4 4v12M14 20v-6h4v6" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('logistics.equipment.e3')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('logistics.equipment.e3h')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /></svg></div>
              <h3 style={{ fontSize: '1rem' }}>{t('logistics.equipment.e4')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('logistics.equipment.e4h')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2" style={{ gap: 40 }}>
          <Reveal className="card card-dark">
            <div className="card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 6.6L21 10l-6.6 1.4L12 18l-2.4-6.6L3 10l6.6-1.4L12 2z" /></svg></div>
            <h3>{t('logistics.sensitive.c1Title')}</h3>
            <p>{t('logistics.sensitive.c1Text')}</p>
          </Reveal>
          <Reveal className="card card-dark">
            <div className="card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /></svg></div>
            <h3>{t('logistics.sensitive.c2Title')}</h3>
            <p>{t('logistics.sensitive.c2Text')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <Reveal className="cta-banner" style={{ background: 'var(--black)' }}>
            <div>
              <h2>{t('logistics.cta.title')}</h2>
              <p>{t('logistics.cta.text')}</p>
            </div>
            <div className="cta-banner-actions">
              <Link href="/reservation" className="btn btn-primary">{t('logistics.cta.book')}</Link>
              <Link href="/contact" className="btn btn-outline">{t('logistics.cta.contact')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
