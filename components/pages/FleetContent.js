'use client';

import Link from 'next/link';
import FleetGrid from '@/components/FleetGrid';
import Reveal from '@/components/Reveal';
import { useT } from '@/lib/i18n';

export default function FleetContent() {
  const t = useT();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.breadcrumbHome')}</Link> / {t('common.nav.fleet')}</div>
          <h1>{t('fleet.hero.title')}</h1>
          <p>{t('fleet.hero.text')}</p>
          <div style={{ marginTop: 28 }}><Link href="/reservation" className="btn btn-primary">{t('fleet.hero.cta')}</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FleetGrid />
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <Reveal className="cta-banner" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.12)', padding: 56 }}>
            <div>
              <h2>{t('fleet.cta.title')}</h2>
              <p>{t('fleet.cta.text')}</p>
            </div>
            <div className="cta-banner-actions">
              <Link href="/reservation" className="btn btn-primary">{t('fleet.cta.book')}</Link>
              <Link href="/contact" className="btn btn-outline">{t('fleet.cta.advice')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
