import { useState, useEffect, useRef } from 'react';
import { getExerciseFrames } from '../../data/exerciseMedia';

// ─── Timer de repos local (visuel uniquement, le vrai timer est dans SessionView) ─────
function RestCountdown({ seconds, onSkip }) {
  const r = 52;
  const circ = 2 * Math.PI * r;

  // On recoit le remaining du parent
  const pct = seconds > 0 ? 1 : 0; // juste un indicateur
  return (
    <div style={{ textAlign: 'center', padding: 'var(--s6)' }}>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--s3)' }}>Repos en cours</div>
      <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', marginBottom: 'var(--s4)' }}>
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
      </div>
      <button onClick={onSkip} style={{ padding: '10px 28px', borderRadius: 'var(--r4)', background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>
        Passer le repos
      </button>
    </div>
  );
}

// ─── Affichage d'un exercice en mode guide ─────────────────────────────────
function GuidedExercise({ exercise, setIdx, totalSets, weight, checkedSets, sessionStarted, onToggleSet, onWeightChange }) {
  const [imgFrame, setImgFrame] = useState(0);
  const [imgError, setImgError] = useState(false);
  const frames = getExerciseFrames(exercise.id);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (frames.length >= 2) {
      intervalRef.current = setInterval(() => setImgFrame(f => (f + 1) % 2), 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [frames.length]);

  // Quel set on est en train de faire (le premier non coche)
  const checkedCount = Array.from({ length: totalSets }, (_, i) =>
    !!(checkedSets && checkedSets[`${exercise.id}_${i}`])
  ).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Image */}
      {frames.length > 0 && !imgError ? (
        <div style={{ background: 'var(--surface-2)', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
          <img src={frames[imgFrame]} alt={exercise.name}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div style={{ height: 200, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 48 }}>&#127947;</span>
        </div>
      )}

      <div style={{ flex: 1, padding: 'var(--s4)', overflowY: 'auto' }}>

        {/* Nom + muscle */}
        <div style={{ marginBottom: 'var(--s4)' }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{exercise.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{exercise.muscle}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {exercise.sets}x{exercise.repsMin === exercise.repsMax ? exercise.repsMin : `${exercise.repsMin}-${exercise.repsMax}`} reps
            {exercise.restSeconds && <span> &middot; {exercise.restSeconds}s repos</span>}
          </div>
        </div>

        {/* Indicateur de sets */}
        <div style={{ marginBottom: 'var(--s4)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--s2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Serie {checkedCount + 1} sur {totalSets}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Array.from({ length: totalSets }, (_, i) => {
              const done = !!(checkedSets && checkedSets[`${exercise.id}_${i}`]);
              return (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: done ? 'var(--success)' : i === checkedCount ? 'var(--accent)' : 'var(--border)',
                  transition: 'background 0.3s',
                }} />
              );
            })}
          </div>
        </div>

        {/* Poids */}
        <div style={{ marginBottom: 'var(--s4)', background: 'var(--surface-2)', borderRadius: 'var(--r2)', padding: 'var(--s3)' }}>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
            Poids (kg)
          </label>
          <input type="number" value={weight || ''} onChange={e => onWeightChange(parseFloat(e.target.value) || 0)}
            placeholder="0" min="0" step="0.5"
            style={{ textAlign: 'center', fontWeight: 800, fontSize: 28 }}
          />
        </div>

        {/* Tip */}
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--surface-2)', borderRadius: 'var(--r1)', padding: 'var(--s3)', lineHeight: 1.6 }}>
          &#128161; {exercise.tips}
        </div>
      </div>

      {/* Bouton serie faite */}
      {sessionStarted && checkedCount < totalSets && (
        <div style={{ padding: 'var(--s4)', paddingBottom: 'max(var(--s4), env(safe-area-inset-bottom))', flexShrink: 0 }}>
          <button onClick={() => onToggleSet(checkedCount)} style={{
            width: '100%', padding: 'var(--s4)',
            background: 'var(--accent)', color: 'white',
            borderRadius: 'var(--r2)', fontWeight: 800, fontSize: 16,
            boxShadow: '0 4px 16px rgba(var(--accent-rgb,99,102,241),0.4)',
          }}>
            &#10003; Serie {checkedCount + 1} terminee !
          </button>
        </div>
      )}

      {checkedCount >= totalSets && (
        <div style={{ padding: 'var(--s4)', paddingBottom: 'max(var(--s4), env(safe-area-inset-bottom))', flexShrink: 0 }}>
          <div style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 700, fontSize: 15, padding: 'var(--s3)' }}>
            &#10003; Exercice complete !
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────
export default function GuidedSessionView({
  exercises,
  workout,
  sessionStarted,
  restTimer,
  onClose,
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const exercise = exercises[currentIdx];
  if (!exercise) return null;

  const weight = workout.todaySession.weights[exercise.id];
  const checkedSets = workout.todaySession.sets;

  const checkedCount = Array.from({ length: exercise.sets }, (_, i) =>
    !!(checkedSets && checkedSets[`${exercise.id}_${i}`])
  ).filter(Boolean).length;

  const allSetsForThisEx = checkedCount >= exercise.sets;
  const isLastExercise = currentIdx === exercises.length - 1;

  function handleToggleSet(setIdx) {
    workout.toggleSet(exercise.id, setIdx);
    restTimer.startRest(exercise.restSeconds || 90);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--s3) var(--s4)',
        paddingTop: 'calc(var(--s3) + env(safe-area-inset-top))',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button onClick={onClose} style={{ fontSize: 14, color: 'var(--text-muted)', background: 'none', padding: '4px 8px' }}>
          &#10006; Quitter
        </button>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
          {currentIdx + 1} / {exercises.length}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {exercises.map((_, i) => (
            <div key={i} style={{
              width: i === currentIdx ? 16 : 8, height: 4, borderRadius: 2,
              background: i < currentIdx ? 'var(--success)' : i === currentIdx ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* Timer de repos overlay */}
      {restTimer.active ? (
        <RestCountdown seconds={restTimer.remaining} onSkip={restTimer.skipRest} />
      ) : (
        <GuidedExercise
          exercise={exercise}
          totalSets={exercise.sets}
          weight={weight}
          checkedSets={checkedSets}
          sessionStarted={sessionStarted}
          onToggleSet={handleToggleSet}
          onWeightChange={kg => workout.setWeight(exercise.id, kg)}
        />
      )}

      {/* Navigation bas */}
      {!restTimer.active && (
        <div style={{
          display: 'flex', gap: 'var(--s3)',
          padding: 'var(--s3) var(--s4)',
          paddingBottom: 'max(var(--s3), env(safe-area-inset-bottom))',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            style={{ flex: 1, padding: 'var(--s3)', borderRadius: 'var(--r2)', background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: 14, opacity: currentIdx === 0 ? 0.4 : 1 }}
          >
            &#8592; Precedent
          </button>
          {isLastExercise ? (
            <button onClick={onClose} style={{ flex: 1, padding: 'var(--s3)', borderRadius: 'var(--r2)', background: 'var(--success)', color: 'white', fontSize: 14, fontWeight: 700 }}>
              &#127937; Terminer
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(i => Math.min(exercises.length - 1, i + 1))}
              style={{ flex: 1, padding: 'var(--s3)', borderRadius: 'var(--r2)', background: allSetsForThisEx ? 'var(--accent)' : 'var(--surface-2)', color: allSetsForThisEx ? 'white' : 'var(--text-secondary)', fontSize: 14, fontWeight: allSetsForThisEx ? 700 : 400 }}
            >
              Suivant &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
