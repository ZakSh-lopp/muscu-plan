import { WORKOUT_TYPES } from '../../data/workout';

function computeVolume(session) {
  const wt = WORKOUT_TYPES[session.type];
  if (!wt) return 0;
  let vol = 0;
  wt.exercises.forEach(ex => {
    const w = session.weights?.[ex.id] || 0;
    const repsAvg = Math.round((ex.repsMin + ex.repsMax) / 2);
    for (let i = 0; i < ex.sets; i++) {
      if (session.sets?.[`${ex.id}_${i}`]) {
        vol += w * repsAvg;
      }
    }
  });
  return vol;
}

export default function HistoryView({ history }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ padding: 'var(--s6)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 'var(--s3)' }}>&#128203;</div>
        <div style={{ fontWeight: 700, marginBottom: 'var(--s2)' }}>Aucune seance enregistree</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Tes seances apparaitront ici apres les avoir terminees.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--s4)' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--s4)' }}>
        {history.length} seance{history.length > 1 ? 's' : ''} enregistree{history.length > 1 ? 's' : ''}
      </div>

      {history.map((session, i) => {
        const wt = WORKOUT_TYPES[session.type];
        const checkedCount = Object.values(session.sets || {}).filter(Boolean).length;
        const volume = computeVolume(session);
        const date = new Date(session.date);
        const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        const rpeVals = Object.values(session.rpe || {}).filter(Boolean);
        const rpeAvg = rpeVals.length > 0
          ? Math.round(rpeVals.reduce((a, b) => a + b, 0) / rpeVals.length * 10) / 10
          : null;

        return (
          <div key={i} className="card" style={{ marginBottom: 'var(--s3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s3)' }}>
              <span style={{ fontSize: 24 }}>{wt?.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{session.type}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{dateStr}</div>
              </div>
              {session.duration && (
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: 'var(--text-muted)', background: 'var(--surface-2)',
                  padding: '3px 8px', borderRadius: 'var(--r4)',
                }}>
                  &#9201; {session.duration}
                </span>
              )}
            </div>

            {/* Metriques */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s2)', marginBottom: 'var(--s3)' }}>
              <Metric label="Series" value={checkedCount} />
              <Metric label="Volume" value={volume > 0 ? `${volume.toLocaleString()}kg` : '-'} />
              {rpeAvg !== null
                ? <Metric label="RPE moy." value={rpeAvg} color={rpeAvg <= 7 ? 'var(--success)' : rpeAvg >= 9 ? 'var(--danger)' : 'var(--warning)'} />
                : <Metric label="Exercices" value={Object.keys(session.weights || {}).length} />
              }
            </div>

            {/* Charges */}
            {Object.keys(session.weights || {}).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s1)', marginBottom: 'var(--s2)' }}>
                {Object.entries(session.weights).map(([exId, kg]) => {
                  const ex = wt?.exercises.find(e => e.id === exId);
                  return ex ? (
                    <span key={exId} style={{
                      fontSize: 11, padding: '2px 8px',
                      background: 'var(--surface-2)', borderRadius: 'var(--r4)',
                      color: 'var(--text-secondary)',
                    }}>
                      {ex.name.split(' ').slice(0, 2).join(' ')} {kg}kg
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {session.note && (
              <div style={{
                marginTop: 'var(--s2)', fontSize: 13,
                color: 'var(--text-secondary)', fontStyle: 'italic',
                borderTop: '1px solid var(--border)', paddingTop: 'var(--s2)',
              }}>
                "{session.note}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', background: 'var(--surface-2)', borderRadius: 'var(--r1)', padding: 'var(--s2)' }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: color || 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{label}</div>
    </div>
  );
}
