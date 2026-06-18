import { useState, useEffect, useRef } from 'react';
import { getExerciseFrames, getAltFrames } from '../../data/exerciseMedia';

/* ─── Image animée + overlay ↻ / ℹ ──────────────────────────────────── */
function ExerciseImage({ exerciseId, exerciseName, swappedAlt, hasAlts, onCycleAlt, tip, showTip, onToggleTip }) {
  const [frame, setFrame] = useState(0);
  const [error, setError] = useState(false);
  const ref = useRef(null);
  const frames = swappedAlt ? getAltFrames(swappedAlt) : getExerciseFrames(exerciseId);

  useEffect(() => { setFrame(0); setError(false); }, [exerciseId, swappedAlt]);
  useEffect(() => {
    clearInterval(ref.current);
    if (frames.length >= 2) {
      ref.current = setInterval(() => setFrame(f => (f + 1) % 2), 800);
    }
    return () => clearInterval(ref.current);
  }, [frames.length, exerciseId, swappedAlt]);

  return (
    <div style={{ position: 'relative', height: 190, flexShrink: 0, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {frames.length > 0 && !error ? (
        <img src={frames[frame]} alt={exerciseName}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
          onError={() => setError(true)} />
      ) : (
        <span style={{ fontSize: 56, opacity: 0.25 }}>🏋️</span>
      )}

      {/* Boutons overlay */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {hasAlts && (
          <button onClick={onCycleAlt} title="Exercice alternatif" style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.88)', border: '1.5px solid var(--border)',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>↻</button>
        )}
        {tip && (
          <button onClick={onToggleTip} title="Conseil" style={{
            width: 36, height: 36, borderRadius: 8,
            background: showTip ? 'var(--accent)' : 'rgba(255,255,255,0.88)',
            border: '1.5px solid var(--border)',
            fontSize: 15, color: showTip ? 'white' : 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>ℹ</button>
        )}
      </div>

      {/* Badge ALT */}
      {swappedAlt && (
        <div style={{ position: 'absolute', top: 8, left: 8, background: '#f59e0b', color: '#000', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 800 }}>
          ALT
        </div>
      )}

      {/* Tip overlay flottant */}
      {showTip && tip && (
        <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 52,
          background: 'rgba(15,15,20,0.92)', borderRadius: 10, padding: '8px 12px',
          borderLeft: '3px solid var(--accent)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>💡 {tip}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Cercle générique ───────────────────────────────────────────────── */
function Circle({ value, sub, label, color, pulse, onClick }) {
  return (
    <div onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{
        width: 74, height: 74, borderRadius: '50%',
        border: `2.5px solid ${color || 'var(--border)'}`,
        background: pulse ? 'rgba(99,102,241,0.09)' : 'transparent',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.3s',
      }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: color || 'var(--text)', lineHeight: 1.1, textAlign: 'center', padding: '0 6px' }}>{value}</span>
        {sub && <span style={{ fontSize: 9, color, fontWeight: 700, marginTop: 2 }}>{sub}</span>}
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

/* ─── Pavé numérique poids ───────────────────────────────────────────── */
function WeightPad({ value, onChange, onClose }) {
  const [str, setStr] = useState(value > 0 ? String(value) : '');
  function press(k) {
    if (k === '⌫') return setStr(s => s.slice(0, -1));
    if (k === '.') return str.includes('.') ? null : setStr(s => s + '.');
    setStr(s => s.length < 6 ? s + k : s);
  }
  const keys = ['1','2','3','⌫','4','5','6','OK','7','8','9','.','','0','',''];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface)', borderRadius: '18px 18px 0 0', padding: 'var(--s4)', paddingBottom: 'max(var(--s4), env(safe-area-inset-bottom))' }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Kilogrammes</div>
        <div style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, color: 'var(--accent)', marginBottom: 'var(--s4)', minHeight: 50 }}>
          {str || '0'} kg
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {keys.map((k, i) =>
            k === 'OK' ? (
              <button key={i} onClick={() => { onChange(parseFloat(str) || 0); onClose(); }}
                style={{ padding: 16, background: 'var(--accent)', color: 'white', borderRadius: 'var(--r1)', fontWeight: 800, fontSize: 16 }}>OK</button>
            ) : k ? (
              <button key={i} onClick={() => press(k)}
                style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r1)', fontWeight: 700, fontSize: 18, color: k === '⌫' ? 'var(--danger)' : 'var(--text)' }}>{k}</button>
            ) : <div key={i} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Écran repos plein écran ────────────────────────────────────────── */
function RestScreen({ restTimer }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--s6)', gap: 'var(--s4)' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Repos en cours</div>
      <div style={{ fontSize: 72, fontWeight: 900, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', letterSpacing: -3 }}>
        {restTimer.formatted}
      </div>
      <button onClick={restTimer.skipRest} style={{
        padding: '12px 40px', borderRadius: 'var(--r4)',
        background: 'var(--surface-2)', color: 'var(--text-secondary)',
        border: '1.5px solid var(--border)', fontSize: 15, fontWeight: 600,
      }}>Passer →</button>
    </div>
  );
}

/* ─── Vue exercice — layout fixe sans scroll ─────────────────────────── */
function GuidedExercise({ exercise, swappedName, workout, sessionStarted, restTimer, onCycleAlt }) {
  const [showTip, setShowTip] = useState(false);
  const [showWeightPad, setShowWeightPad] = useState(false);

  const weight = workout.todaySession.weights[exercise.id] || 0;
  const checkedSets = workout.todaySession.sets;
  const checkedCount = Array.from({ length: exercise.sets }, (_, i) =>
    !!(checkedSets && checkedSets[`${exercise.id}_${i}`])
  ).filter(Boolean).length;
  const allDone = checkedCount >= exercise.sets;

  const repsText = exercise.repsMin === exercise.repsMax
    ? `${exercise.repsMin}` : `${exercise.repsMin}-${exercise.repsMax}`;

  const suggestion = workout.getWeightSuggestion(exercise.id, exercise.sets);
  const hasAlts = !!(exercise.alternatives && exercise.alternatives.length > 0);
  const displayName = swappedName || exercise.name;

  const restDur = exercise.restSeconds || 90;
  const restDisplay = restTimer.active
    ? restTimer.formatted
    : `${String(Math.floor(restDur / 60)).padStart(2,'0')}:${String(restDur % 60).padStart(2,'0')}`;

  const seriesColor = allDone ? 'var(--success)' : checkedCount > 0 ? '#f59e0b' : 'var(--text-secondary)';

  function handlePlus() {
    if (!sessionStarted || allDone) return;
    workout.toggleSet(exercise.id, checkedCount);
    restTimer.startRest(restDur);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* Image avec tip overlay — pas de scroll */}
      <ExerciseImage
        exerciseId={exercise.id}
        exerciseName={displayName}
        swappedAlt={swappedName}
        hasAlts={hasAlts}
        tip={exercise.tips}
        showTip={showTip}
        onCycleAlt={onCycleAlt}
        onToggleTip={() => setShowTip(v => !v)}
      />

      {/* Zone info compacte — PAS de scroll */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '10px var(--s4) 0' }}>

        {/* Nom + muscle + suggestion */}
        <div style={{ flexShrink: 0, marginBottom: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>{displayName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{exercise.muscle}</div>
          {suggestion && (
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 3, color: suggestion.isDefault ? 'var(--accent)' : suggestion.delta > 0 ? 'var(--success)' : suggestion.delta < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
              {suggestion.isDefault ? '★' : suggestion.delta > 0 ? '↑' : suggestion.delta < 0 ? '↓' : '→'} Poids recommandé : {suggestion.suggestion > 0 ? `${suggestion.suggestion} kg` : 'Poids du corps'}
            </div>
          )}
          {swappedName && (
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginTop: 2 }}>
              ⇆ {swappedName}
              <button onClick={() => workout.resetSwap(exercise.id)} style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-muted)', background: 'none' }}>↩</button>
            </div>
          )}
        </div>

        {/* 3 cercles */}
        <div style={{ display: 'flex', justifyContent: 'space-around', flexShrink: 0, paddingBottom: 8 }}>
          <Circle value={repsText} label={"Répétitions\nrequises"} color="var(--text-secondary)" />
          <Circle
            value={restDisplay}
            sub={restTimer.active ? 'SKIP' : undefined}
            label="Repos"
            color={restTimer.active ? 'var(--accent)' : 'var(--border)'}
            pulse={restTimer.active}
            onClick={restTimer.active ? restTimer.skipRest : undefined}
          />
          <Circle value={`${checkedCount}/${exercise.sets}`} label={"Séries\neffectuées"} color={seriesColor} />
        </div>

        {/* Barre de progression séries */}
        <div style={{ flexShrink: 0, marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: exercise.sets }, (_, i) => {
              const done = !!(checkedSets && checkedSets[`${exercise.id}_${i}`]);
              return (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: done ? 'var(--success)' : i === checkedCount ? 'var(--accent)' : 'var(--border)',
                  transition: 'background 0.3s',
                }} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Barre d'action bas — fixe en bas */}
      <div style={{
        flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--surface)',
        padding: 'var(--s3) var(--s4)',
        paddingBottom: 'max(var(--s3), env(safe-area-inset-bottom))',
        display: 'flex', gap: 'var(--s2)', alignItems: 'stretch',
      }}>
        <button onClick={() => setShowWeightPad(true)} style={{
          flex: 1, padding: 'var(--s2) var(--s3)', borderRadius: 'var(--r2)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, minWidth: 0,
        }}>
          <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kilogrammes</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: weight > 0 ? 'var(--text)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {weight > 0 ? `${weight} kg` : '— kg'}
          </span>
        </button>

        <div style={{
          flex: 1, padding: 'var(--s2) var(--s3)', borderRadius: 'var(--r2)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, minWidth: 0,
        }}>
          <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Répétitions</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{repsText} reps</span>
        </div>

        <button
          onClick={handlePlus}
          disabled={!sessionStarted || allDone}
          style={{
            width: 56, borderRadius: 'var(--r2)', flexShrink: 0,
            background: allDone ? 'var(--success)' : (sessionStarted ? '#10b981' : 'var(--border)'),
            color: 'white', fontSize: allDone ? 22 : 32, fontWeight: 900,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: (sessionStarted && !allDone) ? '0 4px 14px rgba(16,185,129,0.45)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {allDone ? '✓' : '+'}
        </button>
      </div>

      {showWeightPad && (
        <WeightPad
          value={weight}
          onChange={kg => workout.setWeight(exercise.id, kg)}
          onClose={() => setShowWeightPad(false)}
        />
      )}
    </div>
  );
}

/* ─── Composant principal ────────────────────────────────────────────── */
export default function GuidedSessionView({ exercises, workout, sessionStarted, restTimer, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const exercise = exercises[currentIdx];
  if (!exercise) return null;

  const swappedName = workout.swappedExercises?.[exercise.id] || null;
  const alts = exercise.alternatives || [];
  const isLast = currentIdx === exercises.length - 1;

  const checkedSets = workout.todaySession.sets;
  const checkedCount = Array.from({ length: exercise.sets }, (_, i) =>
    !!(checkedSets && checkedSets[`${exercise.id}_${i}`])
  ).filter(Boolean).length;
  const allSetsOk = checkedCount >= exercise.sets;

  function cycleAlt() {
    if (!alts.length) return;
    const cur = workout.swappedExercises?.[exercise.id];
    const curIdx = cur ? alts.findIndex(a => a.name === cur) : -1;
    const nextIdx = curIdx + 1;
    if (nextIdx >= alts.length) workout.resetSwap(exercise.id);
    else workout.swapExercise(exercise.id, alts[nextIdx].name);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',  /* ← aucun scroll sur la page entière */
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--s3) var(--s4)',
        paddingTop: 'calc(var(--s3) + env(safe-area-inset-top))',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <button onClick={onClose} style={{ fontSize: 22, color: 'var(--text-secondary)', background: 'none', padding: '0 6px' }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
          {currentIdx + 1}/{exercises.length} {exercise.muscle}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {currentIdx > 0 && (
            <button onClick={() => setCurrentIdx(i => i - 1)} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none' }}>◀ Préc.</button>
          )}
          {isLast ? (
            <button onClick={onClose} style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, background: 'none' }}>Fin 🏁</button>
          ) : (
            <button onClick={() => setCurrentIdx(i => i + 1)} style={{
              fontSize: 13, fontWeight: allSetsOk ? 700 : 400,
              color: allSetsOk ? 'var(--accent)' : 'var(--text-muted)', background: 'none',
            }}>Suivant ▶</button>
          )}
        </div>
      </div>

      {/* ── Barre progression exercices ── */}
      <div style={{ display: 'flex', gap: 3, padding: '5px var(--s4)', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {exercises.map((_, i) => (
          <div key={i} onClick={() => setCurrentIdx(i)} style={{
            flex: i === currentIdx ? 2 : 1, height: 3, borderRadius: 2, cursor: 'pointer',
            background: i < currentIdx ? 'var(--success)' : i === currentIdx ? 'var(--accent)' : 'var(--border)',
            transition: 'all 0.25s',
          }} />
        ))}
      </div>

      {/* ── Corps — flex: 1 overflow hidden = pas de scroll ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {restTimer.active ? (
          <RestScreen restTimer={restTimer} />
        ) : (
          <GuidedExercise
            exercise={exercise}
            swappedName={swappedName}
            workout={workout}
            sessionStarted={sessionStarted}
            restTimer={restTimer}
            onCycleAlt={cycleAlt}
          />
        )}
      </div>
    </div>
  );
}
