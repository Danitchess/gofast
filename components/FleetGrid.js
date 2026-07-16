'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import VehicleIcon from './VehicleIcon';
import { VEHICLES } from '@/lib/vehicles';
import { useT } from '@/lib/i18n';

const TAB_KEYS = ['all', 'leger', 'moyen', 'lourd', 'remorque'];

export default function FleetGrid() {
  const [filter, setFilter] = useState('all');
  const t = useT();
  const visible = filter === 'all' ? VEHICLES : VEHICLES.filter((v) => v.category === filter);

  return (
    <>
      <div className="fleet-tabs reveal in-view">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            className={`fleet-tab${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {t(`fleet.tabs.${key}`)}
          </button>
        ))}
      </div>

      <div className="fleet-grid">
        {visible.map((v) => (
          <Reveal key={v.id} className="fleet-card">
            <div className="fleet-visual" data-tag={v.tag}>
              <VehicleIcon paths={v.iconPaths} size={68} />
            </div>
            <div className="fleet-body">
              <h3>{v.name}</h3>
              <div className="fleet-cat">{v.type}</div>
              <div className="fleet-specs">
                <div><span>{t('fleet.specs.volume')}</span><span>{v.volumeM3} m³</span></div>
                <div><span>{t('fleet.specs.weight')}</span><span>{v.maxWeightKg.toLocaleString('fr-BE')} kg</span></div>
                <div><span>{t('fleet.specs.tailLift')}</span><span>{v.tailLift ? t('fleet.specs.yes') : t('fleet.specs.no')}</span></div>
              </div>
              <a href="/reservation" className="btn btn-dark btn-block">{t('fleet.bookVehicle')}</a>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
