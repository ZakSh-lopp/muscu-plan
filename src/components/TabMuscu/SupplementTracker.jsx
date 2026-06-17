import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';
import { SUPPLEMENTS } from '../../data/workout';

export default function SupplementTracker() {
  const todayKey = new Date().toISOString().split('T')[0];
  const [log, setLog] = useStorage(STORAGE_KEYS.SUPPLEMENTS_TODAY, {});
  const todayLog = log[todayKey] || {};

  function toggle(id) {
    setLog(prev => ({
      ...prev,
      [todayKey]: { ...todayLog, [id]: !todayLog[id] },
    }));
  }

  const doneCount = SUPPLEMENTS.filter(s => todayLog[s.id]).length;
  const allDone = doneCount === SUPPLEMENTS.length;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s3)' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Supplements</div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: allDone ? 'var(--success)' : 'var(--text-muted)',
          background: allDone ? '#dcfce7' : 'var(--surface-2)',
          padding: '2px 8px', borderRadius: 20,
        }}>
          {doneCount}/{SUPPLEMENTS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: 'var(--s3)' }}>
        <div
          className="progress-fill"
          style={{
            width: `${(doneCount / SUPPLEMENTS.length) * 100}%`,
            background: allDone ? 'var(--success)' : 'var(--accent)',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
        {SUPPLEMENTS.map(s => {
          const done = !!todayLog[s.id];
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--s2)',
                padding: 'var(--s2) var(--s3)',
                borderRadius: 'var(--r2)',
                border: `1.5px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                background: done ? '#dcfce720' : 'var(--surface-2)',
                color: done ? 'var(--success)' : 'var(--text)',
                fontWeight: 600, fontSize: 13,
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div style={{ fontSize: 10, color: done ? 'var(--success)' : 'var(--text-muted)', fontWeight: 400 }}>
                  {s.dose} · {s.time}
                </div>
              </div>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: done ? 'var(--success)' : 'var(--border)',
                color: 'white', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
