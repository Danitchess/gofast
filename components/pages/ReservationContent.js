'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import BookingWizard from '@/components/BookingWizard';
import { useT } from '@/lib/i18n';

export default function ReservationContent() {
  const t = useT();

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 60 }}>
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.breadcrumbHome')}</Link> / {t('reservation.meta.title')}</div>
          <h1>{t('reservation.hero.title')}</h1>
          <p>{t('reservation.hero.text')}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <Suspense fallback={null}>
            <BookingWizard />
          </Suspense>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container grid-3">
          <Reveal className="card">
            <div className="card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div>
            <h3>{t('reservation.perks.p1Title')}</h3>
            <p>{t('reservation.perks.p1Text')}</p>
          </Reveal>
          <Reveal className="card">
            <div className="card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /></svg></div>
            <h3>{t('reservation.perks.p2Title')}</h3>
            <p>{t('reservation.perks.p2Text')}</p>
          </Reveal>
          <Reveal className="card">
            <div className="card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" /></svg></div>
            <h3>{t('reservation.perks.p3Title')}</h3>
            <p>{t('reservation.perks.p3Text')} <a href="tel:+3223853430" style={{ color: 'var(--red)', fontWeight: 700 }}>+32 (0)2 385 34 30</a></p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
