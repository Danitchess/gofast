'use client';

import { useState } from 'react';
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { COUNTRIES } from '@/lib/countries';

export default function PhoneField({ id, label, countryCode, localNumber, onCountryChange, onNumberChange, required = true }) {
  const [touched, setTouched] = useState(false);

  const valid = localNumber ? isValidPhoneNumber(localNumber, countryCode) : !required;

  const handleBlur = () => {
    setTouched(true);
    if (localNumber && isValidPhoneNumber(localNumber, countryCode)) {
      const parsed = parsePhoneNumberFromString(localNumber, countryCode);
      if (parsed) onNumberChange(localNumber, parsed.formatInternational());
    }
  };

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <select
          value={countryCode}
          onChange={(e) => onCountryChange(e.target.value)}
          style={{ maxWidth: 110, flexShrink: 0 }}
          aria-label="Indicatif pays"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.dial} {c.code}</option>
          ))}
        </select>
        <input
          type="tel"
          id={id}
          required={required}
          value={localNumber}
          placeholder="470 12 34 56"
          onChange={(e) => onNumberChange(e.target.value, null)}
          onBlur={handleBlur}
        />
      </div>
      {touched && localNumber && !valid && (
        <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>Numéro invalide pour {COUNTRIES.find((c) => c.code === countryCode)?.name}.</span>
      )}
    </div>
  );
}
