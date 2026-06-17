import { useStorage } from '../../hooks/useStorage';

const GLASSES_TARGET = 8;
const ML_PER_GLASS = 250;

export default function HydrationTracker() {
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `muscu_hydration_${todayKey}`;
  const [glasses, setGlasses] = useStorage(storageKey, 0);

  function tap(index) {
    // Tap on filled glass → unfill from that point; tap on empty → fill up to that point
    if (index < glasses) {
      setGlasses(index);
    } else {
      setGlasses(index + 1);
    }
  }

  const ml = glasses * ML_PER_GLASS;
  const pct = Math.min(100, Math.round((glasses / GLASSES_TARGET) * 100));
  const done = glasses >= GLASSES_TARGET;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s3)' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>💧 Hydratation</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: done ? 'var(--success)' : 'var(--text-secondary)' }}>
          {glasses}/{GLASSES_TARGET} verres · {(ml / 1000).toFixed(2).replace(/\.?0+$/, '')}L
        </div>
      </div>

      {/* Barre de progression */}
      <div className="progress-bar" style={{ marginBottom: 'var(--s3)' }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: done ? 'var(--success)' : 'var(--accent)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Verres */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: GLASSES_TARGET }, (_, i) => {
          const filled = i < glasses;
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              style={{
                width: 36, height: 44,
                borderRadius: 8,
                border: `2px solid ${filled ? '#29b6f6' : 'var(--border)'}`,
                background: filled ? '#e1f5fe' : 'var(--surface-2)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-end',
                padding: '4px 0',
                transition: 'all 0.15s ease',
                transform: filled ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div style={{
                fontSize: 18,
                filter: filled ? 'none' : 'grayscale(1) opacity(0.3)',
              }}>
                💧
              </div>
            </button>
          );
        })}
      </div>

      {done && (
        <div style={{
          marginTop: 'var(--s3)', textAlign: 'center',
          fontSize: 12, fontWeight: 600, color: 'var(--success)',
        }}>
          🎉 Objectif hydratation atteint !
        </div>
      )}
    </div>
  );
}
