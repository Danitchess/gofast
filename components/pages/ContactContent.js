'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';
import { useT } from '@/lib/i18n';

export default function ContactContent() {
  const t = useT();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.breadcrumbHome')}</Link> / {t('common.nav.contact')}</div>
          <h1>{t('contact.hero.title')}</h1>
          <p>{t('contact.hero.text')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2" style={{ gap: 50, alignItems: 'flex-start' }}>

          <Reveal className="form-card">
            <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>{t('contact.form.title')}</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: 26, fontSize: '0.94rem' }}>{t('contact.form.subtitle')}</p>
            <ContactForm />
          </Reveal>

          <Reveal>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" /></svg></div>
              <h3>{t('contact.info.phoneTitle')}</h3>
              <p><a href="tel:+3223853430">+32 (0)2 385 34 30</a><br />{t('contact.info.phoneText')}</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg></div>
              <h3>{t('contact.info.emailTitle')}</h3>
              <p><a href="mailto:info@gofasttransport.be">info@gofasttransport.be</a><br />{t('contact.info.emailText')}</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
              <h3>{t('contact.info.hqTitle')}</h3>
              <p>Rue du Try 164, 1421 Ophain<br />Avenue Reine Astrid 16, 1440 Braine-le-Château<br />BE0567589659 — Licence n°101019032</p>
            </div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--gray-300)', height: 220 }}>
              <iframe
                title="Localisation Go Fast Logistics"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.32%2C50.63%2C4.38%2C50.67&layer=mapnik&marker=50.65%2C4.35"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
