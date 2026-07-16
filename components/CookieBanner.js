'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const t = useT();

  useEffect(() => {
    const choice = localStorage.getItem('gfl_cookie_choice');
    if (!choice) {
      const t = setTimeout(() => setShow(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (value) => {
    localStorage.setItem('gfl_cookie_choice', value);
    setShow(false);
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className={`cookie-banner${show ? ' show' : ''}`}>
      <p>{t('common.cookie.text')}</p>
      <div className="cookie-actions">
        <button className="cookie-decline" onClick={() => choose('declined')}>{t('common.cookie.decline')}</button>
        <button className="cookie-accept" onClick={() => choose('accepted')}>{t('common.cookie.accept')}</button>
      </div>
    </div>
  );
}
