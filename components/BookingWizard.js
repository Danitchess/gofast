'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { VEHICLES } from '@/lib/vehicles';
import { checkBusinessHours, isDateInPast, todayISO } from '@/lib/businessHours';
import { useT } from '@/lib/i18n';
import VehicleTooltip from './VehicleTooltip';
import AddressField from './AddressField';
import PhoneField from './PhoneField';

const TRANSPORT_TYPES = [
  { value: 'National', icon: '🇧🇪', key: 'national' },
  { value: 'International', icon: '🌍', key: 'international' },
  { value: 'Événementiel', icon: '🎪', key: 'events' },
  { value: 'Logistique et stockage', icon: '📦', key: 'storage' },
];

const initialData = {
  transportType: 'National',
  vehicle: '',
  pickupCity: '',
  pickupCountry: 'BE',
  dropoffCity: '',
  dropoffCountry: 'BE',
  date: '',
  time: '',
  weightKg: '',
  volumeM3: '',
  name: '',
  phoneCountry: 'BE',
  phoneLocal: '',
  phone: '',
  email: '',
  notes: '',
  consent: false,
};

export default function BookingWizard() {
  const t = useT();
  const STEPS = t('reservation.steps');
  const steps = Array.isArray(STEPS) ? STEPS : [];
  const searchParams = useSearchParams();

  const [current, setCurrent] = useState(0);
  const [data, setData] = useState(() => {
    const fromQuery = {};
    ['transportType', 'pickupCity', 'pickupCountry', 'dropoffCity', 'dropoffCountry', 'date'].forEach((key) => {
      const value = searchParams.get(key);
      if (value) fromQuery[key] = value;
    });
    return { ...initialData, ...fromQuery };
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState({});
  const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [addressValid, setAddressValid] = useState(() => {
    const prevalidated = searchParams.get('verified') === '1' && searchParams.get('pickupCity') && searchParams.get('dropoffCity');
    return { pickup: Boolean(prevalidated), dropoff: Boolean(prevalidated) };
  });

  const panelRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const today = todayISO();

  useEffect(() => {
    fetch('/api/vehicles/availability')
      .then((r) => r.json())
      .then((res) => {
        const map = {};
        (res.vehicles || []).forEach((v) => { map[v.id] = v; });
        setAvailability(map);
      })
      .catch(() => {});
  }, []);

  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const setErr = (key, value) => setErrors((e) => ({ ...e, [key]: value }));

  const selectedVehicle = VEHICLES.find((v) => v.id === data.vehicle);

  const validateDateTime = (date, time) => {
    if (date && isDateInPast(date)) return t('reservation.errors.pastDate');
    if (date && time) {
      const check = checkBusinessHours(date, time);
      if (!check.valid) return check.reason;
    }
    return null;
  };

  const handleDateChange = (date) => {
    set('date', date);
    setErr('date', validateDateTime(date, data.time));
  };
  const handleTimeChange = (time) => {
    set('time', time);
    setErr('date', validateDateTime(data.date, time));
  };

  const handleWeightChange = (value) => {
    set('weightKg', value);
    if (value === '') { setErr('weightKg', null); return; }
    const n = Number(value);
    if (Number.isNaN(n) || n <= 0 || n > 30000) {
      setErr('weightKg', t('reservation.errors.weightRange'));
    } else if (selectedVehicle && n > selectedVehicle.maxWeightKg) {
      setErr('weightKg', `${t('reservation.errors.weightExceeds')} (max ${selectedVehicle.maxWeightKg.toLocaleString('fr-BE')} kg).`);
    } else {
      setErr('weightKg', null);
    }
  };

  const handleVolumeChange = (value) => {
    set('volumeM3', value);
    if (value === '') { setErr('volumeM3', null); return; }
    const n = Number(value);
    if (Number.isNaN(n) || n <= 0 || n > 100) {
      setErr('volumeM3', t('reservation.errors.volumeRange'));
    } else if (selectedVehicle && n > selectedVehicle.volumeM3) {
      setErr('volumeM3', `${t('reservation.errors.volumeExceeds')} (max ${selectedVehicle.volumeM3} m³).`);
    } else {
      setErr('volumeM3', null);
    }
  };

  const checkEmail = async (email) => {
    if (!email) { setEmailStatus(null); return; }
    setEmailStatus('checking');
    try {
      const res = await fetch(`/api/verify-email?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      setEmailStatus(json.valid ? 'valid' : 'invalid');
      setErr('email', json.valid ? null : json.reason);
    } catch {
      setEmailStatus(null);
    }
  };

  const goTo = (index) => setCurrent(index);

  const handleNext = () => {
    const panel = panelRefs[current].current;
    if (panel) {
      const requiredFields = panel.querySelectorAll('[required]');
      for (const field of requiredFields) {
        if (!field.reportValidity()) return;
      }
    }
    if (current === 1) {
      if (!addressValid.pickup) { setErr('pickup', t('reservation.errors.cityNotFound')); return; }
      if (!addressValid.dropoff) { setErr('dropoff', t('reservation.errors.cityNotFound')); return; }
      const dateErr = validateDateTime(data.date, data.time);
      if (dateErr) { setErr('date', dateErr); return; }
      if (errors.weightKg || errors.volumeM3) return;
      if (data.vehicle && availability[data.vehicle]?.availableUnits === 0) {
        setErr('vehicle', t('reservation.errors.vehicleUnavailable'));
        return;
      }
    }
    if (current === 2) {
      if (data.phoneLocal && errors.phone) return;
      if (emailStatus === 'invalid') return;
    }
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors || {});
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setErr('form', t('reservation.errors.generic'));
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-card">
        <div className="success-box">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h3 style={{ fontSize: '1.3rem' }}>{t('reservation.success.title')}</h3>
          <p style={{ color: 'var(--gray-600)', marginTop: 10, maxWidth: 420, marginInline: 'auto' }}>
            {t('reservation.success.text')}
          </p>
          <Link href="/" className="btn btn-dark" style={{ marginTop: 26 }}>{t('reservation.success.home')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-shell">
      <div className="booking-steps">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`booking-step${i === current ? ' active' : ''}${i < current ? ' done' : ''}`}
            onClick={() => i < current && goTo(i)}
            style={{ cursor: i < current ? 'pointer' : 'default' }}
          >
            <div className="num">{i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="booking-wrap">
        <div className="form-card">
          <form onSubmit={handleSubmit}>

            {/* Panel 1 — transport type */}
            <div ref={panelRefs[0]} className={`booking-panel${current === 0 ? ' active' : ''}`}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t('reservation.step1.title')}</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.92rem' }}>{t('reservation.step1.subtitle')}</p>
              <div className="vehicle-pick" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 30 }}>
                {TRANSPORT_TYPES.map((tt) => (
                  <div
                    key={tt.value}
                    className={`transport-type${data.transportType === tt.value ? ' selected' : ''}`}
                    onClick={() => set('transportType', tt.value)}
                  >
                    <h5>{tt.icon} {t(`reservation.transportTypes.${tt.key}`)}</h5>
                    <span>{t(`reservation.transportTypes.${tt.key}Hint`)}</span>
                  </div>
                ))}
              </div>
              <div className="wizard-nav" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={handleNext}>{t('reservation.step1.continue')}</button>
              </div>
            </div>

            {/* Panel 2 — trip details */}
            <div ref={panelRefs[1]} className={`booking-panel${current === 1 ? ' active' : ''}`}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t('reservation.step2.title')}</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.92rem' }}>{t('reservation.step2.subtitle')}</p>

              <AddressField
                countryLabel={t('reservation.step2.fromCountry')}
                cityLabel={t('reservation.step2.fromCity')}
                cityPlaceholder={t('reservation.step2.fromPlaceholder')}
                city={data.pickupCity}
                country={data.pickupCountry}
                onCityChange={(v) => { set('pickupCity', v); setErr('pickup', null); }}
                onCountryChange={(v) => set('pickupCountry', v)}
                onValidChange={(valid) => setAddressValid((s) => ({ ...s, pickup: valid }))}
                initialVerified={addressValid.pickup}
              />
              {errors.pickup && <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: -12, marginBottom: 16 }}>{errors.pickup}</p>}
              <AddressField
                countryLabel={t('reservation.step2.toCountry')}
                cityLabel={t('reservation.step2.toCity')}
                cityPlaceholder={t('reservation.step2.toPlaceholder')}
                city={data.dropoffCity}
                country={data.dropoffCountry}
                onCityChange={(v) => { set('dropoffCity', v); setErr('dropoff', null); }}
                onCountryChange={(v) => set('dropoffCountry', v)}
                onValidChange={(valid) => setAddressValid((s) => ({ ...s, dropoff: valid }))}
                initialVerified={addressValid.dropoff}
              />
              {errors.dropoff && <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: -12, marginBottom: 16 }}>{errors.dropoff}</p>}

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="date">{t('reservation.step2.date')}</label>
                  <input type="date" id="date" required min={today} value={data.date} onChange={(e) => handleDateChange(e.target.value)} />
                </div>
                <div className="field-group">
                  <label htmlFor="time">{t('reservation.step2.time')}</label>
                  <input type="time" id="time" required value={data.time} onChange={(e) => handleTimeChange(e.target.value)} />
                </div>
              </div>
              {errors.date && <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: -12, marginBottom: 16 }}>{errors.date}</p>}
              <p style={{ color: 'var(--gray-600)', fontSize: '0.78rem', marginTop: -14, marginBottom: 18 }}>
                {t('reservation.step2.hoursNote')}
              </p>

              <div className="field-group">
                <label>{t('reservation.step2.vehicle')}</label>
                <div className="vehicle-pick">
                  {VEHICLES.map((v) => {
                    const avail = availability[v.id];
                    const isOut = avail && avail.availableUnits === 0;
                    const isLow = avail && avail.availableUnits === 1;
                    return (
                      <div
                        key={v.id}
                        className={`vehicle-option${data.vehicle === v.id ? ' selected' : ''}`}
                        onClick={() => {
                          if (isOut) return;
                          set('vehicle', v.id);
                          setErr('vehicle', null);
                        }}
                        style={isOut ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                      >
                        <h5>{v.shortName}<VehicleTooltip vehicle={v} /></h5>
                        <span>{v.hint}</span>
                        {isOut && <div style={{ fontSize: '0.7rem', color: 'var(--red)', fontWeight: 700, marginTop: 4 }}>{t('reservation.step2.unavailable')}</div>}
                        {isLow && !isOut && <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>{t('reservation.step2.lastOne')}</div>}
                      </div>
                    );
                  })}
                </div>
                {errors.vehicle && <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: 8 }}>{errors.vehicle}</p>}
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="weight">{t('reservation.step2.weight')} <span className="opt">{t('reservation.step2.optional')}</span></label>
                  <input type="number" id="weight" min="1" max="30000" placeholder={t('reservation.step2.weightPlaceholder')} value={data.weightKg} onChange={(e) => handleWeightChange(e.target.value)} />
                  {errors.weightKg && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{errors.weightKg}</span>}
                </div>
                <div className="field-group">
                  <label htmlFor="volume">{t('reservation.step2.volume')} <span className="opt">{t('reservation.step2.optional')}</span></label>
                  <input type="number" id="volume" min="0.1" max="100" step="0.1" placeholder={t('reservation.step2.volumePlaceholder')} value={data.volumeM3} onChange={(e) => handleVolumeChange(e.target.value)} />
                  {errors.volumeM3 && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{errors.volumeM3}</span>}
                </div>
              </div>

              <div className="wizard-nav">
                <button type="button" className="btn btn-dark" onClick={handlePrev}>{t('reservation.step2.back')}</button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>{t('reservation.step2.continue')}</button>
              </div>
            </div>

            {/* Panel 3 — contact info */}
            <div ref={panelRefs[2]} className={`booking-panel${current === 2 ? ' active' : ''}`}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t('reservation.step3.title')}</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.92rem' }}>{t('reservation.step3.subtitle')}</p>

              <div className="field-group">
                <label htmlFor="name">{t('reservation.step3.name')}</label>
                <input type="text" id="name" required value={data.name} onChange={(e) => set('name', e.target.value)} />
              </div>

              <div className="field-row">
                <PhoneField
                  id="phone"
                  label={t('reservation.step3.phone')}
                  countryCode={data.phoneCountry}
                  localNumber={data.phoneLocal}
                  onCountryChange={(c) => set('phoneCountry', c)}
                  onNumberChange={(local, formatted) => {
                    set('phoneLocal', local);
                    set('phone', formatted || local);
                  }}
                />
                <div className="field-group">
                  <label htmlFor="email">{t('reservation.step3.email')}</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={data.email}
                    onChange={(e) => { set('email', e.target.value); setErr('email', null); setEmailStatus(null); }}
                    onBlur={(e) => checkEmail(e.target.value)}
                  />
                  {emailStatus === 'checking' && <span style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>{t('reservation.step3.checking')}</span>}
                  {errors.email && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{errors.email}</span>}
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="notes">{t('reservation.step3.notes')} <span className="opt">{t('reservation.step2.optional')}</span></label>
                <textarea id="notes" placeholder={t('reservation.step3.notesPlaceholder')} value={data.notes} onChange={(e) => set('notes', e.target.value)} />
              </div>

              <div className="wizard-nav">
                <button type="button" className="btn btn-dark" onClick={handlePrev}>{t('reservation.step3.back')}</button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>{t('reservation.step3.continue')}</button>
              </div>
            </div>

            {/* Panel 4 — summary */}
            <div ref={panelRefs[3]} className={`booking-panel${current === 3 ? ' active' : ''}`}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t('reservation.step4.title')}</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.92rem' }}>{t('reservation.step4.subtitle')}</p>

              <div className="summary-box">
                <div className="summary-row"><span>{t('reservation.step4.transportType')}</span><span>{data.transportType}</span></div>
                {selectedVehicle && <div className="summary-row"><span>{t('reservation.step4.vehicle')}</span><span>{selectedVehicle.name}</span></div>}
                <div className="summary-row"><span>{t('reservation.step4.from')}</span><span>{data.pickupCity}, {data.pickupCountry}</span></div>
                <div className="summary-row"><span>{t('reservation.step4.to')}</span><span>{data.dropoffCity}, {data.dropoffCountry}</span></div>
                <div className="summary-row"><span>{t('reservation.step4.date')}</span><span>{data.date} — {data.time}</span></div>
                {data.weightKg && <div className="summary-row"><span>{t('reservation.step4.weight')}</span><span>{data.weightKg} kg</span></div>}
                {data.volumeM3 && <div className="summary-row"><span>{t('reservation.step4.volume')}</span><span>{data.volumeM3} m³</span></div>}
                <div className="summary-row"><span>{t('reservation.step4.name')}</span><span>{data.name}</span></div>
                <div className="summary-row"><span>{t('reservation.step4.phone')}</span><span>{data.phone}</span></div>
                <div className="summary-row"><span>{t('reservation.step4.email')}</span><span>{data.email}</span></div>
                {data.notes && <div className="summary-row"><span>{t('reservation.step4.notes')}</span><span>{data.notes}</span></div>}
              </div>

              {errors.form && <p style={{ color: 'var(--red)', marginTop: 12 }}>{errors.form}</p>}

              <label className="checkbox-row" style={{ marginBottom: 22, marginTop: 20 }}>
                <input type="checkbox" required checked={data.consent} onChange={(e) => set('consent', e.target.checked)} />
                <span>{t('reservation.step4.consent')}</span>
              </label>

              <div className="wizard-nav">
                <button type="button" className="btn btn-dark" onClick={handlePrev}>{t('reservation.step4.back')}</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? t('reservation.step4.sending') : t('reservation.step4.submit')}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
