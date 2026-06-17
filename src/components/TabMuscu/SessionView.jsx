import { useState } from 'react';
import { WORKOUT_TYPES } from '../../data/workout';
import { useSessionTimer, useRestTimer } from '../../hooks/useTimer';
import { getTodayWorkoutType } from '../../hooks/useWorkout';
import ExerciseCard from './ExerciseCard';
import SupplementTracker from './SupplementTracker';
import WeightTracker from './WeightTracker';
import PlateCalculator from './PlateCalculator';

function computeSummary(exercises, todaySession, duration, getPR) {
  let totalVolume = 0, totalSetsTarget = 0, totalSetsDone = 0;
  let rpeSum = 0, rpeCount = 0;
  const prs = [];

  exercises.forEach(ex => {
    const w = todaySession.weights[ex.id] || 0;
    const rpe = todaySession.rpe[ex.id];
    const repsAvg = Math.round((ex.repsMin + ex.repsMax) / 2);
    for (let i = 0; i < ex.sets; i++) {
      totalSetsTarget++;
      if (todaySession.sets[`${ex.id}_${i}`]) { totalSetsDone++; totalVolume += w * repsAvg; }
    }
    if (rpe) { rpeSum += rpe; rpeCount++; }
    if (getPR(ex.id)) prs.push(ex.name);
  });

  const rpeAvg = rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : null;
  return { totalVolume, totalSetsTarget, totalSetsDone, rpeAvg, prs, duration };
}

function StatBox({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r1)', padding: 'var(--s3)', textAlign: 'center' }}>
      <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: color || 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: color || 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function SessionSummary({ summary }) {
  const pct = summary.totalSetsTarget > 0
    ? Math.round((summary.totalSetsDone / summary.totalSetsTarget) * 100) : 0;
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r2)', padding: 'var(--s4)', marginBottom: 'var(--s4)' }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--s3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Bilan de seance
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)', marginBottom: 'var(--s3)' }}>
        <StatBox icon="⏱" label="Duree" value={summary.duration} />
        <StatBox icon="💪" label="Volume" value={`${summary.totalVolume.toLocaleString()} kg`} />
        <StatBox icon="✓" label="Series"
          value={`${summary.totalSetsDone}/${summary.totalSetsTarget}`}
          sub={`${pct}%`}
          color={pct >= 90 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)'}
        />
        {summary.rpeAvg !== null && (
          <StatBox icon="❤" label="RPE moyen" value={summary.rpeAvg}
            color={summary.rpeAvg <= 7 ? 'var(--success)' : summary.rpeAvg >= 9 ? 'var(--danger)' : 'var(--warning)'}
          />
        )}
      </div>
      {summary.prs.length > 0 && (
        <div style={{ background: 'linear-gradient(90deg,#ff6f0022,#ffa00022)', border: '1px solid #ff6f0055', borderRadius: 'var(--r1)', padding: 'var(--s3)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ff6f00', marginBottom: 4 }}>🏆 Records personnels</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{summary.prs.join(' · ')}</div>
        </div>
      )}
    </div>
  );
}

export default function SessionView({ workout }) {
  const todayType = getTodayWorkoutType();
  const [selectedType, setSelectedType] = useState(todayType);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionNote, setSessionNote] = useState('');
  const [showFinish, setShowFinish] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState(false);

  const sessionTimer = useSessionTimer();
  const restTimer = useRestTimer();

  const currentWorkout = WORKOUT_TYPES[selectedType];
  const isRestDay = todayType === 'Repos';

  const summary = showFinish ? computeSummary(
    currentWorkout.exercises, workout.todaySession, sessionTimer.formatted, workout.getPR
  ) : null;

  function handleStart() { setSessionStarted(true); sessionTimer.start(); }

  function handleFinish() {
    workout.finishWorkout(selectedType, sessionNote, sessionTimer.formatted);
    sessionTimer.stop();
    setSessionStarted(false);
    setShowFinish(false);
  }

  function handleSetCheck() { restTimer.startRest(90); }

  if (isRestDay) {
    return (
      <div style={{ padding: 'var(--s4)', paddingBottom: 'max(calc(var(--tab-height) + env(safe-area-inset-bottom)), calc(var(--tab-height) + 50px))' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--s6)' }}>
          <div style={{ fontSize: 48, marginBottom: 'var(--s3)' }}>😴</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 'var(--s2)' }}>Jour de repos</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            La recuperation fait partie de la progression. Profites-en pour manger et dormir !
          </div>
        </div>
        <div style={{ marginTop: 'var(--s4)' }}><SupplementTracker /></div>
        <div style={{ marginTop: 'var(--s4)' }}><WeightTracker /></div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--s4)', paddingBottom: 'max(calc(var(--tab-height) + env(safe-area-inset-bottom)), calc(var(--tab-height) + 50px))' }}>

      {/* Selecteur Full A/B/C */}
      <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
        {Object.keys(WORKOUT_TYPES).filter(t => t !== 'Repos').map(type => {
          const wt = WORKOUT_TYPES[type];
          const isSelected = selectedType === type;
          return (
            <button key={type} onClick={() => !sessionStarted && setSelectedType(type)} style={{
              flex: 1, padding: 'var(--s2)', borderRadius: 'var(--r2)',
              border: `2px solid ${isSelected ? wt.color : 'var(--border)'}`,
              background: isSelected ? `${wt.color}18` : 'var(--surface)',
              color: isSelected ? wt.color : 'var(--text-secondary)',
              fontWeight: 700, fontSize: 13,
              opacity: sessionStarted && !isSelected ? 0.4 : 1,
              cursor: sessionStarted && !isSelected ? 'not-allowed' : 'pointer',
            }}>
              {wt.emoji} {type}
            </button>
          );
        })}
      </div>

      {/* Card infos séance + bouton start + calculateur */}
      <div className="card" style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{currentWorkout.emoji} {currentWorkout.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{currentWorkout.muscles}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
            {sessionStarted && (
              <div style={{ fontWeight: 700, fontSize: 20, fontVariantNumeric: 'tabular-nums', color: currentWorkout.color }}>
                ⏱ {sessionTimer.formatted}
              </div>
            )}
            {/* Bouton calculateur de disques — inline dans la card */}
            <button
              onClick={() => setShowPlateCalc(true)}
              title="Calculateur de disques"
              style={{
                width: 40, height: 40, borderRadius: 'var(--r2)',
                background: 'var(--surface-2)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ⚖
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'var(--s4)' }}>
          {!sessionStarted ? (
            <button className="btn-primary" onClick={handleStart} style={{ background: currentWorkout.color }}>
              ▶ Demarrer la seance
            </button>
          ) : (
            <button className="btn-secondary" onClick={() => setShowFinish(true)}
              style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}>
              ✓ Terminer la seance
            </button>
          )}
        </div>
      </div>

      {/* Exercices */}
      {currentWorkout.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          sessionStarted={sessionStarted}
          checkedSets={workout.todaySession.sets}
          weight={workout.todaySession.weights[exercise.id]}
          rpe={workout.todaySession.rpe[exercise.id]}
          isPR={workout.getPR(exercise.id)}
          weightSuggestion={workout.getWeightSuggestion(exercise.id, exercise.sets)}
          onToggleSet={(setIdx) => { workout.toggleSet(exercise.id, setIdx); handleSetCheck(); }}
          onWeightChange={(kg) => workout.setWeight(exercise.id, kg)}
          onRpeChange={(rpe) => workout.setRpe(exercise.id, rpe)}
        />
      ))}

      {/* Trackers */}
      <div style={{ marginTop: 'var(--s4)' }}><SupplementTracker /></div>
      <div style={{ marginTop: 'var(--s4)' }}><WeightTracker /></div>

      {/* Timer repos flottant */}
      {restTimer.active && (
        <div className="rest-timer">
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Repos</span>
          <span className="rest-timer-time">{restTimer.formatted}</span>
          <button onClick={restTimer.skipRest}
            style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 8px', background: 'var(--surface-2)', borderRadius: 'var(--r1)' }}>
            Skip
          </button>
        </div>
      )}

      {/* Modal fin de seance */}
      {showFinish && (
        <div className="modal-overlay" onClick={() => setShowFinish(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-handle" />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 'var(--s4)' }}>🎉 Fin de seance</div>
            {summary && <SessionSummary summary={summary} />}
            <textarea
              placeholder="Note de seance (optionnel)..."
              value={sessionNote}
              onChange={e => setSessionNote(e.target.value)}
              rows={3}
              style={{ marginBottom: 'var(--s4)', resize: 'none' }}
            />
            <button className="btn-primary" onClick={handleFinish}>✓ Valider et sauvegarder</button>
          </div>
        </div>
      )}

      {/* Calculateur de disques (modal) */}
      {showPlateCalc && <PlateCalculator onClose={() => setShowPlateCalc(false)} />}
    </div>
  );
}
