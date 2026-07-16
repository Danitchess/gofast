'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n';

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const t = useT();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Front-end demo only: no backend wired up yet.
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <div className="success-box">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3>{t('contact.form.successTitle')}</h3>
        <p style={{ color: 'var(--gray-600)', marginTop: 8 }}>{t('contact.form.successText')}</p>
      </div>
    );
  }

  const subjectOptions = t('contact.form.subjectOptions');
  const options = Array.isArray(subjectOptions) ? subjectOptions : [];

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field-group">
          <label htmlFor="c-name">{t('contact.form.name')}</label>
          <input type="text" id="c-name" name="name" required />
        </div>
        <div className="field-group">
          <label htmlFor="c-company">{t('contact.form.company')} <span className="opt">{t('contact.form.optional')}</span></label>
          <input type="text" id="c-company" name="company" />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label htmlFor="c-email">{t('contact.form.email')}</label>
          <input type="email" id="c-email" name="email" required />
        </div>
        <div className="field-group">
          <label htmlFor="c-phone">{t('contact.form.phone')}</label>
          <input type="tel" id="c-phone" name="phone" required />
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="c-subject">{t('contact.form.subject')}</label>
        <select id="c-subject" name="subject">
          {options.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="field-group">
        <label htmlFor="c-message">{t('contact.form.message')}</label>
        <textarea id="c-message" name="message" required placeholder={t('contact.form.messagePlaceholder')} />
      </div>
      <label className="checkbox-row" style={{ marginBottom: 20 }}>
        <input type="checkbox" required />
        <span>{t('contact.form.consent')}</span>
      </label>
      <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
        {sending ? t('contact.form.sending') : t('contact.form.submit')}
      </button>
    </form>
  );
}
