import { useState } from 'react';
import {
  type ChallengeEquipment,
  type EquipmentSettings,
  readEquipmentSettings,
  writeEquipmentSettings,
} from '../lib/equipment';

const EQUIPMENT_ITEMS: Array<{
  key: ChallengeEquipment;
  label: string;
  icon: string;
}> = [
  { key: 'but', label: 'But', icon: '🥅' },
  { key: 'mur', label: 'Mur', icon: '🧱' },
];

export default function EquipmentToggle() {
  const [settings, setSettings] = useState<EquipmentSettings>(() =>
    readEquipmentSettings(),
  );

  function toggle(key: ChallengeEquipment) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    writeEquipmentSettings(next);
  }

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {EQUIPMENT_ITEMS.map(({ key, label, icon }) => {
        const active = settings[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-pressed={active}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              width: 72,
              padding: '10px 8px',
              borderRadius: 10,
              border: '3px solid var(--ink)',
              background: active ? 'var(--yellow)' : '#fff',
              opacity: active ? 1 : 0.45,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 26 }}>{icon}</span>
            <span style={{ font: '800 11px Nunito', color: 'var(--ink)' }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
