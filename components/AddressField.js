'use client';

import { useEffect, useRef, useState } from 'react';
import { COUNTRIES } from '@/lib/countries';

const DIACRITICS_RE = new RegExp('[̀-ͯ]', 'g');

function normalize(str) {
  return (str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_RE, '');
}

export default function AddressField({ countryLabel, cityLabel, cityPlaceholder, city, country, onCityChange, onCountryChange, onValidChange, initialVerified = false }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(initialVerified);
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState(null);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    onValidChange?.(verified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified]);

  const fetchSuggestions = async (value) => {
    const params = new URLSearchParams({ q: value, country });
    const res = await fetch(`/api/geocode?${params}`);
    const data = await res.json();
    return data.results || [];
  };

  const handleCityInput = (value) => {
    onCityChange(value);
    setVerified(false);
    setLocalError(null);
    clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(value);
        setSuggestions(results);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const pickSuggestion = (s) => {
    onCityChange(s.city);
    if (s.countryCode && COUNTRIES.some((c) => c.code === s.countryCode)) {
      onCountryChange(s.countryCode);
    }
    setSuggestions([]);
    setOpen(false);
    setVerified(true);
    setLocalError(null);
  };

  const handleBlur = async () => {
    setTouched(true);
    setOpen(false);
    if (verified || !city || city.trim().length < 2) return;

    setLoading(true);
    try {
      const results = suggestions.length > 0 ? suggestions : await fetchSuggestions(city);
      const match = results.find((r) => normalize(r.city) === normalize(city));
      if (match) {
        setVerified(true);
        setLocalError(null);
        if (match.countryCode && COUNTRIES.some((c) => c.code === match.countryCode)) {
          onCountryChange(match.countryCode);
        }
      } else {
        setVerified(false);
        setLocalError('Ville introuvable — merci de sélectionner une suggestion dans la liste.');
      }
    } catch {
      // Network hiccup: don't hard-block the user, but don't mark verified either.
      setLocalError(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="field-row">
      <div className="field-group">
        <label>{countryLabel}</label>
        <select value={country} onChange={(e) => { onCountryChange(e.target.value); setVerified(false); }}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="field-group" ref={boxRef} style={{ position: 'relative' }}>
        <label>{cityLabel}</label>
        <input
          type="text"
          value={city}
          placeholder={cityPlaceholder}
          required
          onChange={(e) => handleCityInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={handleBlur}
          autoComplete="off"
          style={touched && city && !verified ? { borderColor: 'var(--red)' } : undefined}
        />
        {open && suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 20,
              background: 'var(--white)',
              border: '1px solid var(--gray-300)',
              borderRadius: 8,
              marginTop: 4,
              boxShadow: 'var(--shadow-md)',
              maxHeight: 220,
              overflowY: 'auto',
              listStyle: 'none',
              padding: 4,
            }}
          >
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => pickSuggestion(s)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
        {loading && <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>Vérification…</span>}
        {!loading && touched && city && verified && (
          <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>✓ Ville reconnue</span>
        )}
        {!loading && localError && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{localError}</span>}
      </div>
    </div>
  );
}
