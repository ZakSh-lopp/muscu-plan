import { useState } from 'react';
import { WORKOUT_TYPES } from '../../data/workout';
import { useSessionTimer, useRestTimer } from '../../hooks/useTimer';
import { getTodayWorkoutType } from '../../hooks/useWorkout';
import { useCoach } from '../../hooks/useCoach';
import { useNotifications } from '../../hooks/useNotifications';
import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';
import ExerciseCard from './ExerciseCard';
import SupplementTracker from './SupplementTracker';
import WeightTracker from './WeightTracker';
import PlateCalculator from './PlateCalculator';
import GuidedSessionView from './GuidedSessionView';
import CoachCard from './CoachCard';

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
        <StatBox icon="&#9201;" label="Duree" value={summary.duration} />
        <StatBox icon="&#128170;" label="Volume" value={`${summary.totalVolume.toLocaleString()} kg`} />
        <StatBox icon="&#10003;" label="Series"
          value={`${summary.totalSetsDone}/${summary.totalSetsTarget}`}
          sub={`${pct}%`}
          color={pct >= 90 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)'}
        />
        {summary.rpeAvg !== null && (
          <StatBox icon="&#10084;" label="RPE moyen" value={summary.rpeAvg}
            color={summary.rpeAvg <= 7 ? 'var(--success)' : summary.rpeAvg >= 9 ? 'var(--danger)' : 'var(--warning)'}
          />
        )}
      </div>
      {summary.prs.length > 0 && (
        <div style={{ background: 'linear-gradient(90deg,#ff6f0022,#ffa00022)', border: '1px solid #ff6f0055', borderRadius: 'var(--r1)', padding: 'var(--s3)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ff6f00', marginBottom: 4 }}>&#127942; Records personnels</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{summary.prs.join(' · ')}</div>
        </div>
      )}
    </div>
  );
}

// Modal parametres de notification
function NotifSettingsModal({ onClose }) {
  const { notifEnabled, notifTime, loading, enable, disable, update, supplEnabled, enableSupplements, disableSupplements } = useNotifications();
  const [time, setTime] = useState(notifTime || '09:00');
  const [result, setResult] = useState(null);

  async function handleToggle() {
    if (notifEnabled) {
      await disable();
      setResult('Notifications desactivees');
    } else {
      const ok = await enable(time);
      setResult(ok ? 'Rappel programme a ' + time : 'Permission refusee. Allez dans Parametres Android > Applications > Muscu Plan > Notifications pour les activer.');
    }
  }

  async function handleSupplToggle() {
    if (supplEnabled) {
      await disableSupplements();
      setResult('Rappels supplements desactives');
    } else {
      const ok = await enableSupplements();
      setResult(ok ? 'Rappels supplements actives (8h, 13h, 21h)' : 'Permission refusee');
    }
  }

  async function handleTimeChange(e) {
    setTime(e.target.value);
    if (notifEnabled) await update(e.target.value);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 'var(--s4)' }}>&#128276; Notifications</div>

        {/* Seance */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Rappel seance</div>
        <div style={{ marginBottom: 'var(--s3)' }}>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
            Heure du rappel
          </label>
          <input type="time" value={time} onChange={handleTimeChange}
            style={{ fontSize: 18, fontWeight: 700, padding: '8px 12px' }}
          />
        </div>
        <button onClick={handleToggle} disabled={loading} style={{
          width: '100%', padding: 'var(--s3)', borderRadius: 'var(--r2)',
          background: notifEnabled ? 'var(--danger)' : 'var(--accent)',
          color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 'var(--s4)',
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Chargement...' : notifEnabled ? 'Desactiver le rappel seance' : 'Activer le rappel seance'}
        </button>

        {/* Supplements */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--s3)', marginBottom: 'var(--s3)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Rappels supplements</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 'var(--s3)', lineHeight: 1.5 }}>
            ☀️ 8h Matin · &#9728; 13h Midi · 🌙 21h Soir
          </div>
          <button onClick={handleSupplToggle} disabled={loading} style={{
            width: '100%', padding: 'var(--s3)', borderRadius: 'var(--r2)',
            background: supplEnabled ? 'var(--danger)' : '#10b981',
            color: 'white', fontWeight: 700, fontSize: 15,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Chargement...' : supplEnabled ? 'Desactiver rappels supplements' : 'Activer rappels supplements'}
          </button>
        </div>

        {result && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--s2)' }}>
            {result}
          </div>
        )}
        <button className="btn-secondary" onClick={onClose} style={{ width: '100%', marginTop: 'var(--s2)' }}>Fermer</button>
      </div>
    </div>
  );
}

export default function SessionView({ workout }) {
  const todayType = getTodayWorkoutType();

  // Timer AVANT les useState — on s'en sert pour initialiser sessionStarted
  const sessionTimer = useSessionTimer();

  // Persist selectedType so it survives app restart
  const [selectedType, setSelectedTypeState] = useState(() => {
    try {
      const s = localStorage.getItem('muscu_active_workout_type');
      return s || (todayType === 'Repos' ? 'FullA' : todayType);
    } catch { return todayType; }
  });
  function setSelectedType(t) {
    setSelectedTypeState(t);
    try { localStorage.setItem('muscu_active_workout_type', t); } catch {}
  }

  // Init depuis le timer (SESSION_START_TS en localStorage) → survit au kill du WebView
  const [sessionStarted, setSessionStarted] = useState(sessionTimer.running);
  const [sessionNote, setSessionNote] = useState('');
  const [showFinish, setShowFinish] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [showGuided, setShowGuided] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const restTimer = useRestTimer();

  // Hydratation pour le coach
  const [hydration] = useStorage(STORAGE_KEYS.HYDRATION_TODAY, 0);
  const { insights } = useCoach({
    history: workout.history,
    todaySession: workout.todaySession,
    hydration,
  });

  const currentWorkout = WORKOUT_TYPES[selectedType];
  const isRestDay = todayType === 'Repos';

  // Filtrer les exercices desactives
  const activeExercises = currentWorkout.exercises.filter(
    ex => !workout.disabledExercises.includes(ex.id)
  );

  const summary = showFinish ? computeSummary(
    currentWorkout.exercises, workout.todaySession, sessionTimer.formatted, workout.getPR
  ) : null;

  function handleStart() {
    setSessionStarted(true);
    sessionTimer.start();
    try { localStorage.setItem('muscu_active_workout_type', selectedType); } catch {}
  }

  function handleFinish() {
    workout.finishWorkout(selectedType, sessionNote, sessionTimer.formatted);
    sessionTimer.stop();
    setSessionStarted(false);
    setShowFinish(false);
    try { localStorage.removeItem('muscu_active_workout_type'); } catch {}
  }

  function handleSetCheck(exercise) {
    restTimer.startRest(exercise.restSeconds || 90);
  }


  return (
    <div style={{ padding: 'var(--s4)', paddingBottom: 'max(calc(var(--tab-height) + env(safe-area-inset-bottom)), calc(var(--tab-height) + 50px))' }}>

      {/* Coach insights */}
      <CoachCard insights={insights} />

      {/* Banniere jour de repos */}
      {isRestDay && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', padding: 'var(--s3) var(--s4)', marginBottom: 'var(--s3)', background: 'var(--surface-2)', border: '1.5px solid var(--border)' }}>
          <span style={{ fontSize: 28 }}>&#128564;</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Jour de repos</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tu peux quand meme consulter ou faire une seance.</div>
          </div>
        </div>
      )}

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

      {/* Card infos seance */}
      <div className="card" style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{currentWorkout.emoji} {currentWorkout.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{currentWorkout.muscles}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
            {sessionStarted && (
              <div style={{ fontWeight: 700, fontSize: 18, fontVariantNumeric: 'tabular-nums', color: currentWorkout.color }}>
                &#9201; {sessionTimer.formatted}
              </div>
            )}
            {/* Rappel */}
            <button onClick={() => setShowNotifSettings(true)} title="Rappel quotidien" style={{
              width: 36, height: 36, borderRadius: 'var(--r2)',
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              &#128276;
            </button>
            {/* Calculateur */}
            <button onClick={() => setShowPlateCalc(true)} title="Calculateur de disques" style={{
              width: 36, height: 36, borderRadius: 'var(--r2)',
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              &#9878;
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'var(--s4)', display: 'flex', gap: 'var(--s2)' }}>
          {!sessionStarted ? (
            <>
              <button className="btn-primary" onClick={handleStart} style={{ background: currentWorkout.color, flex: 1 }}>
                &#9654; Demarrer
              </button>
              <button onClick={() => { handleStart(); setShowGuided(true); }} style={{
                padding: 'var(--s3) var(--s4)', borderRadius: 'var(--r2)',
                background: `${currentWorkout.color}20`, border: `1.5px solid ${currentWorkout.color}`,
                color: currentWorkout.color, fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                &#128247; Guide
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--s2)', width: '100%' }}>
              <button onClick={() => setShowGuided(true)} style={{
                flex: 1, padding: 'var(--s3)', borderRadius: 'var(--r2)',
                border: `1.5px solid ${currentWorkout.color}`,
                background: `${currentWorkout.color}15`, color: currentWorkout.color,
                fontWeight: 700, fontSize: 13,
              }}>
                &#128247; Mode guide
              </button>
              <button className="btn-secondary" onClick={() => setShowFinish(true)}
                style={{ flex: 1, justifyContent: 'center', color: 'var(--danger)' }}>
                &#10003; Terminer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exercices desactives (affichage compact) */}
      {workout.disabledExercises.length > 0 && (
        <div style={{ marginBottom: 'var(--s3)', fontSize: 12, color: 'var(--text-muted)', padding: 'var(--s2) var(--s3)', background: 'var(--surface-2)', borderRadius: 'var(--r1)' }}>
          {workout.disabledExercises.length} exercice(s) desactive(s)
        </div>
      )}

      {/* Liste exercices */}
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
          note={workout.exerciseNotes[exercise.id]}
          isDisabled={workout.disabledExercises.includes(exercise.id)}
          swappedName={workout.swappedExercises[exercise.id]}
          onToggleSet={(setIdx) => { workout.toggleSet(exercise.id, setIdx); handleSetCheck(exercise); }}
          onWeightChange={(kg) => workout.setWeight(exercise.id, kg)}
          onRpeChange={(rpe) => workout.setRpe(exercise.id, rpe)}
          onNoteChange={workout.setExerciseNote}
          onToggleDisable={workout.toggleDisableExercise}
          onSwap={workout.swapExercise}
          onResetSwap={workout.resetSwap}
        />
      ))}

      {/* Trackers */}
      <div style={{ marginTop: 'var(--s4)' }}><SupplementTracker /></div>
      <div style={{ marginTop: 'var(--s4)' }}><WeightTracker /></div>

      {/* Timer repos */}
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
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 'var(--s4)' }}>&#127881; Fin de seance</div>
            {summary && <SessionSummary summary={summary} />}
            <textarea
              placeholder="Note de seance (optionnel)..."
              value={sessionNote}
              onChange={e => setSessionNote(e.target.value)}
              rows={3}
              style={{ marginBottom: 'var(--s4)', resize: 'none' }}
            />
            <button className="btn-primary" onClick={handleFinish}>&#10003; Valider et sauvegarder</button>
          </div>
        </div>
      )}

      {/* Calculateur de disques */}
      {showPlateCalc && <PlateCalculator onClose={() => setShowPlateCalc(false)} />}

      {/* Mode guide */}
      {showGuided && (
        <GuidedSessionView
          exercises={activeExercises}
          workout={workout}
          sessionStarted={sessionStarted}
          restTimer={restTimer}
          onClose={() => setShowGuided(false)}
        />
      )}

      {/* Notification settings */}
      {showNotifSettings && <NotifSettingsModal onClose={() => setShowNotifSettings(false)} />}
    </div>
  );
}
