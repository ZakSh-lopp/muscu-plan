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

  // Groupe les suppléments : oméga-3 ensemble, reste séparé
  const omega3 = SUPPLEMENTS.filter(s => s.id.startsWith('omega3'));
  const others = SUPPLEMENTS.filter(s => !s.id.startsWith('omega3'));
  const omega3Done = omega3.filter(s => todayLog[s.id]).length;

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

      <div className="progress-bar" style={{ marginBottom: 'var(--s4)' }}>
        <div className="progress-fill" style={{
          width: `${(doneCount / SUPPLEMENTS.length) * 100}%`,
          background: allDone ? 'var(--success)' : 'var(--accent)',
        }} />
      </div>

      {/* Oméga-3 — bloc groupé avec 3 doses */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 'var(--r2)',
        padding: 'var(--s3)', marginBottom: 'var(--s3)',
        border: `1.5px solid ${omega3Done === 3 ? 'var(--success)' : 'var(--border)'}`,
        position: 'relative', overflow: 'hidden',
      }}>
        {omega3Done === 3 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--success)', borderRadius: '2px 2px 0 0' }} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18 }}>🐟</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: omega3Done === 3 ? 'var(--success)' : 'var(--text)' }}>
              Oméga 3-6-9
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: omega3Done === 3 ? 'var(--success)' : 'var(--text-muted)',
          }}>
            {omega3Done}/3 · 1 cap
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--s2)' }}>
          {omega3.map((s, i) => {
            const done = !!todayLog[s.id];
            const label = ['Matin', 'Midi', 'Soir'][i];
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                style={{
                  flex: 1, padding: 'var(--s2)', borderRadius: 'var(--r1)',
                  border: `1.5px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                  background: done ? '#dcfce730' : 'var(--surface)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 16 }}>{done ? '\u2713' : '\u25cb'}</span>
                <span style={{ fontSize: 10, color: done ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Autres suppléments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
        {others.map(s => {
          const done = !!todayLog[s.id];
          const timeLabel = Array.isArray(s.times) ? s.times[0] : (s.time || '');
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
                {s.dose} · {timeLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
