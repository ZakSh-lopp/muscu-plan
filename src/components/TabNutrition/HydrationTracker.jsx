import { useStorage } from '../../hooks/useStorage';

const GLASSES_TARGET = 8;
const ML_PER_GLASS = 250;

// SVG water drop — fiable sur tous les Android/skins
function WaterDrop({ filled, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"
        fill={filled ? '#29b6f6' : 'var(--border)'}
        opacity={filled ? 1 : 0.5}
      />
    </svg>
  );
}

export default function HydrationTracker() {
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `muscu_hydration_${todayKey}`;
  const [glasses, setGlasses] = useStorage(storageKey, 0);

  function tap(index) {
    setGlasses(index < glasses ? index : index + 1);
  }

  const ml = glasses * ML_PER_GLASS;
  const pct = Math.min(100, Math.round((glasses / GLASSES_TARGET) * 100));
  const done = glasses >= GLASSES_TARGET;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s3)' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          <WaterDrop filled size={16} style={{ verticalAlign: 'middle' }} />{' '}Hydratation
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: done ? 'var(--success)' : 'var(--text-secondary)' }}>
          {glasses}/{GLASSES_TARGET} verres · {(ml / 1000).toFixed(2).replace(/\.?0+$/, '')}L
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: 'var(--s3)' }}>
        <div className="progress-fill" style={{
          width: `${pct}%`,
          background: done ? 'var(--success)' : 'var(--accent)',
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: GLASSES_TARGET }, (_, i) => {
          const filled = i < glasses;
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              style={{
                width: 38, height: 48,
                borderRadius: 8,
                border: `2px solid ${filled ? '#29b6f6' : 'var(--border)'}`,
                background: filled ? '#29b6f618' : 'var(--surface-2)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
                transform: filled ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <WaterDrop filled={filled} size={20} />
            </button>
          );
        })}
      </div>

      {done && (
        <div style={{ marginTop: 'var(--s3)', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--success)' }}>
          Objectif hydratation atteint !
        </div>
      )}
    </div>
  );
}
