'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';
import AddressField from '@/components/AddressField';
import { useT } from '@/lib/i18n';

const TRANSPORT_TYPE_VALUES = ['National', 'International', 'Événementiel', 'Logistique et stockage'];

export default function HomeContent() {
  const t = useT();
  const router = useRouter();
  const marquee = t('home.marquee');
  const marqueeItems = Array.isArray(marquee) ? marquee : [];

  const [quote, setQuote] = useState({
    transportType: 'National',
    pickupCity: '', pickupCountry: 'BE',
    dropoffCity: '', dropoffCountry: 'BE',
    date: '',
  });
  const [addressValid, setAddressValid] = useState({ pickup: false, dropoff: false });
  const [attempted, setAttempted] = useState(false);

  const canSubmit = addressValid.pickup && addressValid.dropoff;

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) return;
    const params = new URLSearchParams({
      transportType: quote.transportType,
      pickupCity: quote.pickupCity,
      pickupCountry: quote.pickupCountry,
      dropoffCity: quote.dropoffCity,
      dropoffCountry: quote.dropoffCountry,
      verified: '1',
    });
    if (quote.date) params.set('date', quote.date);
    router.push(`/reservation?${params}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-shape"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="eyebrow">{t('home.hero.eyebrow')}</span>
              <h1>{t('home.hero.titleStart')}<em>{t('home.hero.titleEm')}</em>{t('home.hero.titleEnd')}</h1>
              <p>{t('home.hero.subtitle')}</p>
              <div className="hero-actions">
                <Link href="/reservation" className="btn btn-primary">{t('home.hero.bookCta')}</Link>
                <Link href="/flotte" className="btn btn-outline">{t('home.hero.fleetCta')}</Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="stat-num"><Counter value={15} suffix="+" /></div>
                  <div className="stat-label">{t('home.hero.statYears')}</div>
                </div>
                <div>
                  <div className="stat-num"><Counter value={24} suffix="/7" /></div>
                  <div className="stat-label">{t('home.hero.statAvailability')}</div>
                </div>
                <div>
                  <div className="stat-num"><Counter value={2000} suffix=" m²" /></div>
                  <div className="stat-label">{t('home.hero.statWarehouse')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems].map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center', gap: 60 }}>
          <Reveal>
            <span className="eyebrow">{t('home.about.eyebrow')}</span>
            <h2>{t('home.about.title')}</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 18, fontSize: '1.05rem' }}>{t('home.about.text')}</p>
            <div style={{ marginTop: 30, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-dark">{t('home.about.cta')}</Link>
            </div>
          </Reveal>
          <Reveal style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}><Counter value={15} suffix="+" /></div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: 6 }}>{t('home.about.statExperience')}</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}><Counter value={500} suffix="+" /></div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: 6 }}>{t('home.about.statMissions')}</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}><Counter value={98} suffix="%" /></div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: 6 }}>{t('home.about.statOnTime')}</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}><Counter value={24} suffix="/7" /></div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: 6 }}>{t('home.about.statReactivity')}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section section--gray">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('home.services.eyebrow')}</span>
            <h2>{t('home.services.title')}</h2>
            <p>{t('home.services.subtitle')}</p>
          </Reveal>
          <div className="grid-3">
            <Reveal className="card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="15" height="12" rx="1" /><path d="M16 10h4l3 3v5h-7" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>
              </div>
              <h3>{t('home.services.card1Title')}</h3>
              <p>{t('home.services.card1Text')}</p>
              <Link href="/logistique" className="card-link">{t('home.services.more')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </Reveal>
            <Reveal className="card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></svg>
              </div>
              <h3>{t('home.services.card2Title')}</h3>
              <p>{t('home.services.card2Text')}</p>
              <Link href="/logistique" className="card-link">{t('home.services.more')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </Reveal>
            <Reveal className="card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 6.6L21 10l-6.6 1.4L12 18l-2.4-6.6L3 10l6.6-1.4L12 2z" /></svg>
              </div>
              <h3>{t('home.services.card3Title')}</h3>
              <p>{t('home.services.card3Text')}</p>
              <Link href="/evenementiel" className="card-link">{t('home.services.more')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container grid-2" style={{ gap: 60 }}>
          <Reveal>
            <span className="eyebrow">{t('home.why.eyebrow')}</span>
            <h2>{t('home.why.title')}</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 16 }}>{t('home.why.text')}</p>
          </Reveal>
          <Reveal>
            <div className="feature-row">
              <div className="feature-num">01</div>
              <div><h4>{t('home.why.f1Title')}</h4><p>{t('home.why.f1Text')}</p></div>
            </div>
            <div className="feature-row">
              <div className="feature-num">02</div>
              <div><h4>{t('home.why.f2Title')}</h4><p>{t('home.why.f2Text')}</p></div>
            </div>
            <div className="feature-row">
              <div className="feature-num">03</div>
              <div><h4>{t('home.why.f3Title')}</h4><p>{t('home.why.f3Text')}</p></div>
            </div>
            <div className="feature-row">
              <div className="feature-num">04</div>
              <div><h4>{t('home.why.f4Title')}</h4><p>{t('home.why.f4Text')}</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="stats-band">
        <div className="container grid-4">
          <Reveal><div className="stat-num"><Counter value={15} suffix="+" /></div><div className="stat-label">{t('home.statsBand.years')}</div></Reveal>
          <Reveal><div className="stat-num"><Counter value={20} suffix="+" /></div><div className="stat-label">{t('home.statsBand.vehicles')}</div></Reveal>
          <Reveal><div className="stat-num"><Counter value={2000} suffix=" m²" /></div><div className="stat-label">{t('home.statsBand.warehouse')}</div></Reveal>
          <Reveal><div className="stat-num"><Counter value={24} suffix="/7" /></div><div className="stat-label">{t('home.statsBand.availability')}</div></Reveal>
        </div>
      </section>

      {/* FLEET PREVIEW */}
      <section className="section section--gray">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('home.fleetPreview.eyebrow')}</span>
            <h2>{t('home.fleetPreview.title')}</h2>
            <p>{t('home.fleetPreview.subtitle')}</p>
          </Reveal>
          <div className="grid-4">
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="7" width="13" height="10" rx="1" /><path d="M14 10h4l3 3v4h-7" /><circle cx="5.5" cy="19" r="1.6" /><circle cx="17.5" cy="19" r="1.6" /></svg>
              </div>
              <h3 style={{ fontSize: '1rem' }}>{t('home.fleetPreview.light')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('home.fleetPreview.lightHint')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="15" height="11" rx="1" /><path d="M16 9h4l3 3v5h-7" /><circle cx="6" cy="18.5" r="1.8" /><circle cx="18" cy="18.5" r="1.8" /></svg>
              </div>
              <h3 style={{ fontSize: '1rem' }}>{t('home.fleetPreview.medium')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('home.fleetPreview.mediumHint')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="5" width="16" height="12" rx="1" /><path d="M17 8h4l2 3v6h-6" /><circle cx="6" cy="19.5" r="1.8" /><circle cx="18.5" cy="19.5" r="1.8" /></svg>
              </div>
              <h3 style={{ fontSize: '1rem' }}>{t('home.fleetPreview.heavy')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('home.fleetPreview.heavyHint')}</p>
            </Reveal>
            <Reveal className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon" style={{ marginInline: 'auto' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="12" height="10" rx="1" /><rect x="13" y="8" width="9" height="8" rx="1" /><circle cx="5" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
              </div>
              <h3 style={{ fontSize: '1rem' }}>{t('home.fleetPreview.trailer')}</h3>
              <p style={{ fontSize: '0.88rem' }}>{t('home.fleetPreview.trailerHint')}</p>
            </Reveal>
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/flotte" className="btn btn-dark">{t('home.fleetPreview.cta')}</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>{t('home.process.eyebrow')}</span>
            <h2>{t('home.process.title')}</h2>
          </Reveal>
          <Reveal className="process">
            <div className="process-line"></div>
            <div className="process-steps">
              <div className="process-step">
                <div className="circle">1</div>
                <h4>{t('home.process.s1Title')}</h4>
                <p>{t('home.process.s1Text')}</p>
              </div>
              <div className="process-step">
                <div className="circle">2</div>
                <h4>{t('home.process.s2Title')}</h4>
                <p>{t('home.process.s2Text')}</p>
              </div>
              <div className="process-step">
                <div className="circle">3</div>
                <h4>{t('home.process.s3Title')}</h4>
                <p>{t('home.process.s3Text')}</p>
              </div>
              <div className="process-step">
                <div className="circle">4</div>
                <h4>{t('home.process.s4Title')}</h4>
                <p>{t('home.process.s4Text')}</p>
              </div>
            </div>
          </Reveal>
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href="/reservation" className="btn btn-primary">{t('home.process.cta')}</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--gray">
        <div className="container">
          <Reveal className="cta-banner">
            <div>
              <h2>{t('home.ctaBanner.title')}</h2>
              <p>{t('home.ctaBanner.text')}</p>
            </div>
            <div className="cta-banner-actions">
              <Link href="/reservation" className="btn btn-primary">{t('home.ctaBanner.book')}</Link>
              <Link href="/contact" className="btn btn-outline">{t('home.ctaBanner.contact')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
