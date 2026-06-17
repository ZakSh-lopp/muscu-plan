import { useState } from 'react';
import { WORKOUT_TYPES } from '../../data/workout';

const ALL_EXERCISES = Object.values(WORKOUT_TYPES)
  .filter(wt => wt.exercises && wt.exercises.length > 0)
  .flatMap(wt => wt.exercises)
  .filter((ex, i, arr) => arr.findIndex(e => e.id === ex.id) === i);

function computeSessionVolume(session) {
  const wt = WORKOUT_TYPES[session.type];
  if (!wt || !wt.exercises) return 0;
  let vol = 0;
  wt.exercises.forEach(ex => {
    const w = session.weights?.[ex.id] || 0;
    const repsAvg = Math.round((ex.repsMin + ex.repsMax) / 2);
    for (let i = 0; i < ex.sets; i++) {
      if (session.sets?.[`${ex.id}_${i}`]) vol += w * repsAvg;
    }
  });
  return vol;
}

function VolumeChart({ history }) {
  const sessions = [...history].reverse().slice(0, 12);
  if (sessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--s5)', color: 'var(--text-muted)', fontSize: 13 }}>
        Pas encore de seances enregistrees
      </div>
    );
  }

  const volumes = sessions.map(s => ({
    vol: computeSessionVolume(s),
    label: s.date ? s.date.slice(5).replace('-', '/') : '?',
    type: s.type,
  }));

  const maxVol = Math.max(...volumes.map(v => v.vol), 1);
  const W = 300;
  const H = 140;
  const padL = 38;
  const padR = 8;
  const padT = 12;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW = Math.max(8, chartW / volumes.length * 0.6);
  const barStep = chartW / volumes.length;

  const typeColors = {
    FullA: '#6c63ff',
    FullB: '#00bcd4',
    FullC: '#4caf50',
  };

  const yLabels = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      {yLabels.map(pct => {
        const y = padT + chartH - pct * chartH;
        const val = Math.round(maxVol * pct);
        return (
          <g key={pct}>
            <line x1={padL} y1={y} x2={W - padR} y2={y}
              stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={padL - 3} y={y + 4} fill="var(--text-muted)"
              fontSize="8" textAnchor="end">
              {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            </text>
          </g>
        );
      })}

      {volumes.map((v, i) => {
        const barH = v.vol > 0 ? Math.max(3, (v.vol / maxVol) * chartH) : 3;
        const x = padL + i * barStep + barStep / 2 - barW / 2;
        const y = padT + chartH - barH;
        const color = typeColors[v.type] || 'var(--accent)';
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              fill={color} rx="2" opacity="0.85" />
            <text x={x + barW / 2} y={H - padB + 10}
              fill="var(--text-muted)" fontSize="7" textAnchor="middle">
              {v.label}
            </text>
            {v.vol > 0 && (
              <text x={x + barW / 2} y={y - 3}
                fill="var(--text-secondary)" fontSize="7" textAnchor="middle">
                {v.vol >= 1000 ? `${(v.vol / 1000).toFixed(1)}k` : v.vol}
              </text>
            )}
          </g>
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
        stroke="var(--border)" strokeWidth="1" />
      <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH}
        stroke="var(--border)" strokeWidth="1" />
    </svg>
  );
}

function ExerciseProgressChart({ history, exerciseId }) {
  const points = [...history]
    .reverse()
    .filter(s => s.weights && s.weights[exerciseId] != null && s.weights[exerciseId] > 0)
    .slice(0, 10)
    .map(s => ({ w: s.weights[exerciseId], label: s.date ? s.date.slice(5).replace('-', '/') : '?' }));

  if (points.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--s5)', color: 'var(--text-muted)', fontSize: 13 }}>
        {points.length === 0
          ? 'Aucune donnee pour cet exercice'
          : 'Besoin de plus de seances pour afficher la progression'}
      </div>
    );
  }

  const weights = points.map(p => p.w);
  const maxW = Math.max(...weights);
  const minW = Math.min(...weights);
  const range = maxW - minW || maxW * 0.2 || 10;
  const padMin = minW - range * 0.15;

  const W = 300;
  const H = 130;
  const padL = 32;
  const padR = 10;
  const padT = 18;
  const padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const toX = i => padL + (i / (points.length - 1)) * chartW;
  const toY = w => padT + chartH - ((w - padMin) / (range * 1.3)) * chartH;

  const polyline = points.map((p, i) => `${toX(i)},${toY(p.w)}`).join(' ');

  const trend = points[points.length - 1].w - points[0].w;
  const trendColor = trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--danger)' : 'var(--text-muted)';

  return (
    <div>
      <div style={{ textAlign: 'right', fontSize: 11, color: trendColor, marginBottom: 4, fontWeight: 600 }}>
        {trend > 0 ? '+' : ''}{trend}kg sur la periode
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <polyline points={polyline}
          fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />

        {points.map((p, i) => {
          const x = toX(i);
          const y = toY(p.w);
          const isFirst = i === 0;
          const isLast = i === points.length - 1;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isFirst || isLast ? 5 : 3.5}
                fill={isLast ? 'var(--accent)' : 'var(--surface)'}
                stroke="var(--accent)" strokeWidth="2" />
              <text x={x} y={y - 8}
                fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
                {p.w}kg
              </text>
              {(isFirst || isLast || points.length <= 5) && (
                <text x={x} y={H - padB + 10}
                  fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}

        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
          stroke="var(--border)" strokeWidth="1" />
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH}
          stroke="var(--border)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function Legend() {
  const items = [
    { label: 'Full A', color: '#6c63ff' },
    { label: 'Full B', color: '#00bcd4' },
    { label: 'Full C', color: '#4caf50' },
  ];
  return (
    <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap', justifyContent: 'center' }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Graphe 1RM estimé (Epley) ──────────────────────────────────────────────
function OneRMChart({ history, exerciseId }) {
  const ex = ALL_EXERCISES.find(e => e.id === exerciseId);
  const repsAvg = ex ? Math.round((ex.repsMin + ex.repsMax) / 2) : 8;

  const points = [...history]
    .reverse()
    .filter(s => s.weights && s.weights[exerciseId] != null && s.weights[exerciseId] > 0)
    .slice(0, 10)
    .map(s => {
      const w = s.weights[exerciseId];
      const oneRM = Math.round(w * (1 + repsAvg / 30));
      return { oneRM, w, label: s.date ? s.date.slice(5).replace('-', '/') : '?' };
    });

  if (points.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--s5)', color: 'var(--text-muted)', fontSize: 13 }}>
        {points.length === 0
          ? 'Aucune donnee pour cet exercice'
          : 'Besoin de plus de seances pour afficher la progression'}
      </div>
    );
  }

  const values = points.map(p => p.oneRM);
  const maxV = Math.max(...values);
  const minV = Math.min(...values);
  const range = maxV - minV || maxV * 0.2 || 10;
  const padMin = minV - range * 0.15;

  const W = 300, H = 130;
  const padL = 34, padR = 10, padT = 18, padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const toX = i => padL + (i / (points.length - 1)) * chartW;
  const toY = v => padT + chartH - ((v - padMin) / (range * 1.3)) * chartH;
  const polyline = points.map((p, i) => `${toX(i)},${toY(p.oneRM)}`).join(' ');
  const area = `${padL},${padT + chartH} ` + points.map((p, i) => `${toX(i)},${toY(p.oneRM)}`).join(' ') + ` ${toX(points.length - 1)},${padT + chartH}`;

  const trend = points[points.length - 1].oneRM - points[0].oneRM;
  const trendColor = trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--danger)' : 'var(--text-muted)';
  const latestOneRM = points[points.length - 1].oneRM;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Actuel : <strong style={{ color: 'var(--accent)', fontSize: 15 }}>{latestOneRM} kg</strong>
        </div>
        <div style={{ fontSize: 11, color: trendColor, fontWeight: 600 }}>
          {trend > 0 ? '+' : ''}{trend}kg sur la periode
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="orm-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#orm-fill)" />
        <polyline points={polyline} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
        {points.map((p, i) => {
          const x = toX(i); const y = toY(p.oneRM);
          const isLast = i === points.length - 1;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isLast ? 5 : 3.5}
                fill={isLast ? 'var(--accent)' : 'var(--surface)'}
                stroke="var(--accent)" strokeWidth="2" />
              <text x={x} y={y - 8} fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
                {p.oneRM}
              </text>
              {(i === 0 || isLast || points.length <= 5) && (
                <text x={x} y={H - padB + 10} fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="var(--border)" strokeWidth="1" />
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="var(--border)" strokeWidth="1" />
      </svg>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
        Formule Epley &middot; {repsAvg} reps moyennes
      </div>
    </div>
  );
}

export default function StatsView({ history }) {
  const [selectedExId, setSelectedExId] = useState('squat');
  const [progTab, setProgTab] = useState('weight'); // 'weight' | '1rm'

  const totalVol = history.reduce((acc, s) => acc + computeSessionVolume(s), 0);
  const totalSessions = history.filter(s => s.type !== 'Repos').length;
  const avgVol = totalSessions > 0 ? Math.round(totalVol / totalSessions) : 0;

  return (
    <div style={{ padding: 'var(--s3) var(--s4)', paddingBottom: 'calc(var(--tab-height) + env(safe-area-inset-bottom) + 80px)' }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
        {[
          { label: 'Seances', value: totalSessions },
          { label: 'Volume total', value: totalVol >= 1000 ? `${(totalVol / 1000).toFixed(0)}k` : totalVol + ' kg' },
          { label: 'Vol. moyen', value: avgVol >= 1000 ? `${(avgVol / 1000).toFixed(0)}k` : avgVol + ' kg' },
        ].map(kpi => (
          <div key={kpi.label} className="card" style={{ textAlign: 'center', padding: 'var(--s3)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>{kpi.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Volume par seance */}
      <div className="card" style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 'var(--s2)' }}>Volume par seance (kg)</div>
        <Legend />
        <div style={{ marginTop: 'var(--s3)' }}>
          <VolumeChart history={history} />
        </div>
      </div>

      {/* Progression poids / 1RM par exercice */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 'var(--s3)' }}>Progression</div>

        {/* Tabs Poids / 1RM */}
        <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s3)', background: 'var(--surface-2)', borderRadius: 'var(--r2)', padding: 3 }}>
          {[{ id: 'weight', label: 'Poids' }, { id: '1rm', label: '1RM estimé' }].map(tab => (
            <button key={tab.id} onClick={() => setProgTab(tab.id)} style={{
              flex: 1, padding: '6px 0', borderRadius: 'calc(var(--r2) - 2px)',
              background: progTab === tab.id ? 'var(--surface)' : 'transparent',
              color: progTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: progTab === tab.id ? 700 : 400, fontSize: 13,
              boxShadow: progTab === tab.id ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.15s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={selectedExId}
          onChange={e => setSelectedExId(e.target.value)}
          style={{ marginBottom: 'var(--s3)', fontSize: 13, padding: '6px 8px' }}
        >
          {ALL_EXERCISES.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>

        {progTab === 'weight'
          ? <ExerciseProgressChart history={history} exerciseId={selectedExId} />
          : <OneRMChart history={history} exerciseId={selectedExId} />
        }
      </div>
    </div>
  );
}
