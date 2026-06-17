import { useState } from 'react';
import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';

const TARGET_WEIGHT = 51;
const START_WEIGHT = 47;

export default function WeightTracker() {
  const [records, setRecords] = useStorage(STORAGE_KEYS.WEIGHT_RECORDS, []);
  const [input, setInput] = useState('');

  const latest = records[records.length - 1]?.weight || START_WEIGHT;
  const progress = Math.min(100, Math.max(0,
    ((latest - START_WEIGHT) / (TARGET_WEIGHT - START_WEIGHT)) * 100
  ));

  function addRecord() {
    const kg = parseFloat(input);
    if (!kg || kg < 30 || kg > 150) return;
    const entry = { date: new Date().toISOString().split('T')[0], weight: kg };
    setRecords(prev => {
      const filtered = prev.filter(r => r.date !== entry.date);
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
    });
    setInput('');
  }

  return (
    <div className="card">
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 'var(--s3)' }}>
        ⚖️ Poids corporel
      </div>

      {/* Valeur actuelle */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s2)', marginBottom: 'var(--s2)' }}>
        <span style={{ fontSize: 32, fontWeight: 800 }}>{latest}</span>
        <span style={{ color: 'var(--text-secondary)' }}>kg</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Objectif : {TARGET_WEIGHT} kg
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 'var(--s3)', height: 10 }}>
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, var(--accent), #f97316)`,
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 'var(--s3)' }}>
        +{(latest - START_WEIGHT).toFixed(1)} kg depuis le départ · {(TARGET_WEIGHT - latest).toFixed(1)} kg restants
      </div>

      {/* Saisie */}
      <div style={{ display: 'flex', gap: 'var(--s2)' }}>
        <input
          type="number"
          inputMode="decimal"
          placeholder={`${latest} kg`}
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          onClick={addRecord}
          style={{
            background: 'var(--accent)', color: 'white',
            padding: 'var(--s2) var(--s4)', borderRadius: 'var(--r1)',
            fontWeight: 700, flexShrink: 0,
          }}
        >
          Sauver
        </button>
      </div>
    </div>
  );
}
