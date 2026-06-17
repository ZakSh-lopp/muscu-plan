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

      <div className="progress-bar" style={{ marginBottom: 'var(--s3)' }}>
        <div className="progress-fill" style={{
          width: `${(doneCount / SUPPLEMENTS.length) * 100}%`,
          background: allDone ? 'var(--success)' : 'var(--accent)',
        }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
        {SUPPLEMENTS.map(s => {
          const done = !!todayLog[s.id];
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 'var(--s2) var(--s3)',
                borderRadius: 'var(--r2)',
                border: `1.5px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                background: done ? '#dcfce720' : 'var(--surface-2)',
                transition: 'all 0.15s ease',
                gap: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Indicateur done — bande colorée en haut */}
              {done && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'var(--success)',
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>{s.emoji}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: done ? 'var(--success)' : 'var(--text)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {s.name}
                </span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 24 }}>
                {s.dose} · {s.time}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
