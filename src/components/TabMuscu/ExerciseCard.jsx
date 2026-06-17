import { useState, useEffect, useRef } from 'react';
import { getExerciseFrames, getAltFrames } from '../../data/exerciseMedia';

function Lightbox({ frames, name, onClose }) {
  const [frame, setFrame] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (frames.length >= 2) {
      timerRef.current = setInterval(() => setFrame(f => (f + 1) % 2), 700);
    }
    return () => clearInterval(timerRef.current);
  }, [frames.length]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'var(--s4)',
      }}
    >
      <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 'var(--s4)', textAlign: 'center' }}>
        {name}
      </div>
      <img
        src={frames[frame]}
        alt={name}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '100%', maxHeight: '70vh',
          objectFit: 'contain',
          borderRadius: 'var(--r2)',
        }}
      />
      <button
        onClick={onClose}
        style={{
          marginTop: 'var(--s5)', color: 'white', fontSize: 14,
          background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--r4)',
          padding: '10px 24px', fontWeight: 600,
        }}
      >
        Fermer
      </button>
    </div>
  );
}

function AltImage({ name }) {
  const frames = getAltFrames(name);
  const [frame, setFrame] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (frames.length >= 2) {
      timerRef.current = setInterval(() => setFrame(f => (f + 1) % 2), 900);
    }
    return () => clearInterval(timerRef.current);
  }, [frames.length]);

  if (!frames.length) return null;

  return (
    <>
      <button
        onClick={() => setLightbox(true)}
        style={{
          width: 44, height: 44, borderRadius: 'var(--r1)',
          overflow: 'hidden', flexShrink: 0,
          border: '1px solid var(--border)',
          background: 'var(--surface-2)', padding: 0,
        }}
      >
        <img src={frames[frame]} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.parentElement.style.display = 'none'; }}
        />
      </button>
      {lightbox && <Lightbox frames={frames} name={name} onClose={() => setLightbox(false)} />}
    </>
  );
}

function OneRMBadge({ weight, repsMin, repsMax }) {
  if (!weight || weight <= 0) return null;
  const reps = Math.round((repsMin + repsMax) / 2);
  if (reps <= 0) return null;
  const oneRM = Math.round(weight * (1 + reps / 30));
  const intensity = Math.round((weight / oneRM) * 100);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--s2)',
      background: 'var(--surface-2)', borderRadius: 'var(--r1)',
      padding: 'var(--s2) var(--s3)', marginTop: 'var(--s2)',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 13 }}>&#127947;</span>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Est. 1RM :
      </span>
      <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>
        {oneRM}kg
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        ({intensity}% intensite &middot; Epley, {reps} reps)
      </span>
    </div>
  );
}

export default function ExerciseCard({
  exercise, sessionStarted,
  checkedSets, weight, rpe, isPR,
  weightSuggestion,
  onToggleSet, onWeightChange, onRpeChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgFrame, setImgFrame] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const frames = getExerciseFrames(exercise.id);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (expanded && frames.length >= 2) {
      intervalRef.current = setInterval(() => setImgFrame(f => (f + 1) % 2), 800);
    } else {
      clearInterval(intervalRef.current);
      setImgFrame(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [expanded, frames.length]);

  const setsChecked = Array.from({ length: exercise.sets }, (_, i) =>
    !!(checkedSets && checkedSets[`${exercise.id}_${i}`])
  );
  const allDone = setsChecked.every(Boolean);
  const anyDone = setsChecked.some(Boolean);

  return (
    <>
      <div
        className="card"
        style={{
          marginBottom: 'var(--s3)',
          borderLeft: `3px solid ${allDone ? 'var(--success)' : anyDone ? 'var(--warning)' : 'var(--border)'}`,
          transition: 'border-color 0.2s ease',
        }}
      >
        {/* En-tete */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', cursor: 'pointer' }}
          onClick={() => setExpanded(e => !e)}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{exercise.name}</span>
              {isPR && <span className="badge badge-pr pr-badge">PR</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {exercise.muscle} &middot; {exercise.sets}x{exercise.repsMin === exercise.repsMax
                ? exercise.repsMin
                : `${exercise.repsMin}-${exercise.repsMax}`}
            </div>
            {!sessionStarted && weightSuggestion && (
              <div style={{
                fontSize: 11, marginTop: 4, fontWeight: 600,
                color: weightSuggestion.isDefault
                  ? 'var(--accent)'
                  : weightSuggestion.delta > 0 ? 'var(--success)'
                  : weightSuggestion.delta < 0 ? 'var(--danger)'
                  : 'var(--text-muted)',
              }}>
                {weightSuggestion.isDefault ? '★' : weightSuggestion.delta > 0 ? '↑' : weightSuggestion.delta < 0 ? '↓' : '→'}{' '}
                {weightSuggestion.suggestion > 0 ? `${weightSuggestion.suggestion}kg` : 'Poids du corps'} &middot; {weightSuggestion.reason}
              </div>
            )}
          </div>

          {/* Sets rapides */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {setsChecked.map((done, i) => (
              <button
                key={i}
                className={`set-checkbox ${done ? 'checked' : ''}`}
                onClick={e => { e.stopPropagation(); if (sessionStarted) onToggleSet(i); }}
                style={{ opacity: sessionStarted ? 1 : 0.4 }}
              >
                {done ? '✓' : i + 1}
              </button>
            ))}
          </div>

          <span style={{
            fontSize: 18, color: 'var(--text-muted)', flexShrink: 0,
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}>&rsaquo;</span>
        </div>

        {/* Contenu expande */}
        {expanded && (
          <div style={{ marginTop: 'var(--s4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--s4)' }}>

            {/* Image principale animee */}
            {frames.length > 0 && (
              <div style={{ marginBottom: 'var(--s4)', position: 'relative' }}>
                <div
                  style={{
                    borderRadius: 'var(--r2)', overflow: 'hidden',
                    background: 'var(--surface-2)', height: 180,
                    display: 'flex', justifyContent: 'center',
                  }}
                >
                  <img
                    src={frames[imgFrame]}
                    alt={exercise.name}
                    style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                    onError={e => { e.target.parentElement.parentElement.style.display = 'none'; }}
                  />
                </div>
                <button
                  onClick={() => setLightbox(true)}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(0,0,0,0.5)', color: 'white',
                    borderRadius: 8, padding: '4px 8px', fontSize: 16,
                  }}
                >
                  &#9974;
                </button>
              </div>
            )}

            {/* Bandeau PR */}
            {isPR && weight > 0 && (
              <div style={{
                background: 'linear-gradient(90deg, #ff6f00, #ffa000)',
                borderRadius: 'var(--r1)', padding: 'var(--s3)',
                marginBottom: 'var(--s3)', textAlign: 'center',
                color: 'white', fontWeight: 700, fontSize: 14,
              }}>
                &#127942; Nouveau record personnel ! {weight}kg
              </div>
            )}

            {/* Tip */}
            <div style={{
              fontSize: 13, color: 'var(--text-secondary)',
              background: 'var(--surface-2)', borderRadius: 'var(--r1)',
              padding: 'var(--s3)', marginBottom: 'var(--s4)', lineHeight: 1.6,
            }}>
              &#128161; {exercise.tips}
            </div>

            {/* Poids + RPE */}
            <div style={{ display: 'flex', gap: 'var(--s3)', marginBottom: 'var(--s2)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Poids (kg)
                </label>
                <input
                  type="number"
                  value={weight || ''}
                  onChange={e => onWeightChange(parseFloat(e.target.value) || 0)}
                  placeholder="0" min="0" step="0.5"
                  style={{ marginTop: 4, textAlign: 'center', fontWeight: 700, fontSize: 18 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  RPE (1-10)
                </label>
                <input
                  type="number"
                  value={rpe || ''}
                  onChange={e => onRpeChange(Math.min(10, Math.max(1, parseInt(e.target.value) || 0)))}
                  placeholder="&mdash;" min="1" max="10"
                  style={{ marginTop: 4, textAlign: 'center', fontWeight: 700, fontSize: 18 }}
                />
              </div>
            </div>

            {/* 1RM estimator */}
            <OneRMBadge
              weight={weight}
              repsMin={exercise.repsMin}
              repsMax={exercise.repsMax}
            />

            {/* Alternatives */}
            {exercise.alternatives && exercise.alternatives.length > 0 && (
              <div style={{ marginTop: 'var(--s4)' }}>
                <div style={{
                  fontSize: 11, color: 'var(--text-muted)', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--s2)',
                }}>
                  Alternatives
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
                  {exercise.alternatives.map((alt, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--s2)',
                      background: 'var(--surface-2)', borderRadius: 'var(--r1)',
                      padding: 'var(--s2)',
                    }}>
                      <AltImage name={alt.name} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{alt.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alt.muscle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {lightbox && <Lightbox frames={frames} name={exercise.name} onClose={() => setLightbox(false)} />}
    </>
  );
}
