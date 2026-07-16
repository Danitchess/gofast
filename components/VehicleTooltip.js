'use client';

import { useState } from 'react';
import VehicleIcon from './VehicleIcon';
import { useT } from '@/lib/i18n';

export default function VehicleTooltip({ vehicle }) {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', marginLeft: 6 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Aperçu du véhicule ${vehicle.shortName}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1.4px solid var(--gray-600)',
          color: 'var(--gray-600)',
          background: 'transparent',
          fontSize: '0.62rem',
          fontWeight: 800,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'help',
          verticalAlign: 'middle',
        }}
      >
        ?
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            zIndex: 30,
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 220,
            background: 'var(--black)',
            color: 'var(--white)',
            borderRadius: 12,
            padding: 16,
            boxShadow: 'var(--shadow-md)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ color: 'var(--red-light)' }}>
              <VehicleIcon paths={vehicle.iconPaths} size={28} />
            </span>
            <strong style={{ fontSize: '0.88rem' }}>{vehicle.name}</strong>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray-300)', lineHeight: 1.6 }}>
            <div>{vehicle.type}</div>
            <div>{t('reservation.tooltip.volume')} : {vehicle.volumeM3} m³</div>
            <div>{t('reservation.tooltip.weight')} : {vehicle.maxWeightKg.toLocaleString('fr-BE')} kg</div>
            <div>{t('reservation.tooltip.tailLift')} : {vehicle.tailLift ? t('reservation.tooltip.yes') : t('reservation.tooltip.no')}</div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '7px solid var(--black)',
            }}
          />
        </div>
      )}
    </span>
  );
}
