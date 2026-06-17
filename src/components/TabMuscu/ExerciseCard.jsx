import { useState, useEffect, useRef } from 'react';
import { getExerciseFrames, getAltFrames } from '../../data/exerciseMedia';

// ────────────────────────────────────────────────────────────
// Lightbox plein ecran
// ────────────────────────────────────────────────────────────
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
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'var(--s4)',
    }}>
      <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 'var(--s4)', textAlign: 'center' }}>{name}</div>
      <img src={frames[frame]} alt={name} onClick={e => e.stopPropagation()}
        style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 'var(--r2)' }}
      />
      <button onClick={onClose} style={{ marginTop: 'var(--s5)', color: 'white', fontSize: 14, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--r4)', padding: '10px 24px', fontWeight: 600 }}>
        Fermer
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Image alternative animee
// ────────────────────────────────────────────────────────────
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
      <button onClick={() => setLightbox(true)} style={{ width: 44, height: 44, borderRadius: 'var(--r1)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)', background: 'var(--surface-2)', padding: 0 }}>
        <img src={frames[frame]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.parentElement.style.display = 'none'; }} />
      </button>
      {lightbox && <Lightbox frames={frames} name={name} onClose={() => setLightbox(false)} />}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Badge 1RM estime
// ────────────────────────────────────────────────────────────
function OneRMBadge({ weight, repsMin, repsMax }) {
  if (!weight || weight <= 0) return null;
  const reps = Math.round((repsMin + repsMax) / 2);
  if (reps <= 0) return null;
  const oneRM = Math.round(weight * (1 + reps / 30));
  const intensity = Math.round((weight / oneRM) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', background: 'var(--surface-2)', borderRadius: 'var(--r1)', padding: 'var(--s2) var(--s3)', marginTop: 'var(--s2)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13 }}>&#127947;</span>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Est. 1RM :</span>
      <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>{oneRM}kg</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({intensity}% intensite &middot; Epley, {reps} reps)</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Placeholder image quand image indisponible
// ────────────────────────────────────────────────────────────
function ImagePlaceholder({ name }) {
  return (
    <div style={{ height: 180, background: 'var(--surface-2)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 'var(--s4)' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M6.5 6.5h11M6.5 12h11M6.5 17.5h6" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="5" r="4" fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="1.5"/>
        <path d="M19 3.5v3M17.5 5h3" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Image non disponible</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Suggestion series d'echauffement pour exercices composes
// ────────────────────────────────────────────────────────────
function WarmupSets({ weight, compound }) {
  if (!compound || !weight || weight < 20) return null;
  const sets = [
    { pct: 40, reps: 10, label: 'Activation' },
    { pct: 60, reps: 6,  label: 'Echauffement' },
    { pct: 80, reps: 3,  label: 'Approche' },
  ];
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r1)', padding: 'var(--s3)', marginBottom: 'var(--s4)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--s2)' }}>
        Series d&apos;echauffement
      </div>
      <div style={{ display: 'flex', gap: 'var(--s2)' }}>
        {sets.map((s, i) => {
          const w = Math.round(weight * s.pct / 10) * 2.5;
          return (
            <div key={i} style={{ flex: 1, textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--r1)', padding: 'var(--s2)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{w}kg</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.reps} reps</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{s.pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Modal note d'exercice
// ────────────────────────────────────────────────────────────
function NoteModal({ exerciseId, exerciseName, currentNote, onSave, onClose }) {
  const [value, setValue] = useState(currentNote || '');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 'var(--s2)' }}>Note — {exerciseName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--s3)' }}>Technique, ressenti, ajustements...</div>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={5}
          placeholder="Ex: Barre trop avancee, corriger la posture des poignets..."
          autoFocus
          style={{ resize: 'vertical', marginBottom: 'var(--s4)' }}
        />
        <div style={{ display: 'flex', gap: 'var(--s3)' }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Annuler</button>
          <button className="btn-primary" onClick={() => { onSave(value); onClose(); }} style={{ flex: 1 }}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Modal swap d'exercice
// ────────────────────────────────────────────────────────────
function SwapModal({ exercise, currentSwap, onSwap, onReset, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 'var(--s4)' }}>Remplacer — {exercise.name}</div>
        {currentSwap && (
          <button onClick={() => { onReset(); onClose(); }} style={{ width: '100%', marginBottom: 'var(--s3)', padding: 'var(--s3)', borderRadius: 'var(--r2)', border: '1.5px solid var(--danger)', color: 'var(--danger)', background: 'transparent', fontWeight: 600, fontSize: 14 }}>
            Restaurer l&apos;original
          </button>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
          {exercise.alternatives.map((alt, i) => (
            <button key={i} onClick={() => { onSwap(alt.name); onClose(); }} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--s3)',
              padding: 'var(--s3)', borderRadius: 'var(--r2)',
              border: `1.5px solid ${currentSwap === alt.name ? 'var(--accent)' : 'var(--border)'}`,
              background: currentSwap === alt.name ? 'var(--accent-dim)' : 'var(--surface)',
              textAlign: 'left',
            }}>
              <AltImage name={alt.name} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{alt.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alt.muscle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Menu d'options (3 points)
// ────────────────────────────────────────────────────────────
function OptionsMenu({ exercise, isDisabled, currentSwap, note, onToggleDisable, onOpenNote, onOpenSwap, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', right: 'var(--s4)', top: 80,
        background: 'var(--surface)', borderRadius: 'var(--r2)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        minWidth: 200, overflow: 'hidden', zIndex: 201,
      }}>
        <button onClick={() => { onOpenNote(); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', width: '100%', padding: 'var(--s3) var(--s4)', fontSize: 14, color: note ? 'var(--accent)' : 'var(--text-primary)', background: 'none' }}>
          <span>&#128221;</span>
          <span>{note ? 'Modifier la note' : 'Ajouter une note'}</span>
        </button>
        {exercise.alternatives && exercise.alternatives.length > 0 && (
          <button onClick={() => { onOpenSwap(); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', width: '100%', padding: 'var(--s3) var(--s4)', fontSize: 14, color: currentSwap ? 'var(--warning)' : 'var(--text-primary)', background: 'none', borderTop: '1px solid var(--border)' }}>
            <span>&#8646;</span>
            <span>{currentSwap ? 'Exercice remplace' : 'Remplacer l\'exercice'}</span>
          </button>
        )}
        <button onClick={() => { onToggleDisable(); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', width: '100%', padding: 'var(--s3) var(--s4)', fontSize: 14, color: isDisabled ? 'var(--success)' : 'var(--danger)', background: 'none', borderTop: '1px solid var(--border)' }}>
          <span>{isDisabled ? '&#9654;' : '&#9646;&#9646;'}</span>
          <span>{isDisabled ? 'Reactiver' : 'Passer cet exercice'}</span>
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Composant principal ExerciseCard
// ────────────────────────────────────────────────────────────
export default function ExerciseCard({
  exercise, sessionStarted,
  checkedSets, weight, rpe, isPR,
  weightSuggestion,
  onToggleSet, onWeightChange, onRpeChange,
  note, onNoteChange,
  isDisabled, onToggleDisable,
  swappedName, onSwap, onResetSwap,
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgFrame, setImgFrame] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const intervalRef = useRef(null);

  const displayName = swappedName || exercise.name;
  const frames = getExerciseFrames(exercise.id);

  useEffect(() => {
    if (expanded && frames.length >= 2 && !imgError) {
      intervalRef.current = setInterval(() => setImgFrame(f => (f + 1) % 2), 800);
    } else {
      clearInterval(intervalRef.current);
      setImgFrame(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [expanded, frames.length, imgError]);

  const setsChecked = Array.from({ length: exercise.sets }, (_, i) =>
    !!(checkedSets && checkedSets[`${exercise.id}_${i}`])
  );
  const allDone = setsChecked.every(Boolean);
  const anyDone = setsChecked.some(Boolean);

  if (isDisabled) {
    return (
      <div className="card" style={{ marginBottom: 'var(--s3)', opacity: 0.5, borderLeft: '3px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, textDecoration: 'line-through', color: 'var(--text-muted)' }}>{displayName}</span>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Exercice desactive</div>
          </div>
          <button onClick={() => onToggleDisable(exercise.id)} style={{ fontSize: 12, color: 'var(--success)', padding: '6px 12px', background: 'var(--surface-2)', borderRadius: 'var(--r1)', border: '1px solid var(--success)', fontWeight: 600 }}>
            Reactiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card" style={{
        marginBottom: 'var(--s3)',
        borderLeft: `3px solid ${allDone ? 'var(--success)' : anyDone ? 'var(--warning)' : 'var(--border)'}`,
        transition: 'border-color 0.2s ease',
        position: 'relative',
      }}>
        {/* En-tete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{displayName}</span>
              {swappedName && <span style={{ fontSize: 10, background: 'var(--warning)', color: '#000', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>SWAP</span>}
              {isPR && <span className="badge badge-pr pr-badge">PR</span>}
              {note && <span title={note} style={{ fontSize: 14 }}>&#128221;</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {exercise.muscle} &middot; {exercise.sets}x{exercise.repsMin === exercise.repsMax ? exercise.repsMin : `${exercise.repsMin}-${exercise.repsMax}`}
              {exercise.restSeconds && <span style={{ color: 'var(--text-muted)' }}> &middot; {exercise.restSeconds}s repos</span>}
            </div>
            {!sessionStarted && weightSuggestion && (
              <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: weightSuggestion.isDefault ? 'var(--accent)' : weightSuggestion.delta > 0 ? 'var(--success)' : weightSuggestion.delta < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                {weightSuggestion.isDefault ? '&#9733;' : weightSuggestion.delta > 0 ? '&#8593;' : weightSuggestion.delta < 0 ? '&#8595;' : '&#8594;'}{' '}
                {weightSuggestion.suggestion > 0 ? `${weightSuggestion.suggestion}kg` : 'Poids du corps'} &middot; {weightSuggestion.reason}
              </div>
            )}
          </div>

          {/* Sets rapides */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {setsChecked.map((done, i) => (
              <button key={i} className={`set-checkbox ${done ? 'checked' : ''}`}
                onClick={e => { e.stopPropagation(); if (sessionStarted) onToggleSet(i); }}
                style={{ opacity: sessionStarted ? 1 : 0.4 }}>
                {done ? '&#10003;' : i + 1}
              </button>
            ))}
          </div>

          {/* Bouton options */}
          <button onClick={e => { e.stopPropagation(); setShowOptions(v => !v); }} style={{ fontSize: 18, color: 'var(--text-muted)', flexShrink: 0, padding: '0 4px', background: 'none' }}>
            &#8942;
          </button>
        </div>

        {/* Contenu expande */}
        {expanded && (
          <div style={{ marginTop: 'var(--s4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--s4)' }}>

            {/* Image principale animee ou placeholder */}
            {frames.length > 0 ? (
              imgError ? (
                <ImagePlaceholder name={displayName} />
              ) : (
                <div style={{ marginBottom: 'var(--s4)', position: 'relative' }}>
                  <div style={{ borderRadius: 'var(--r2)', overflow: 'hidden', background: 'var(--surface-2)', height: 180, display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={frames[imgFrame]}
                      alt={displayName}
                      style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                      onError={() => setImgError(true)}
                    />
                  </div>
                  <button onClick={() => setLightbox(true)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 8, padding: '4px 8px', fontSize: 16 }}>
                    &#9974;
                  </button>
                </div>
              )
            ) : null}

            {/* Series d'echauffement (exercices composes uniquement) */}
            <WarmupSets weight={weight} compound={exercise.compound} />

            {/* Note de l'utilisateur */}
            {note && (
              <div style={{ background: 'rgba(var(--accent-rgb,99,102,241),0.1)', borderRadius: 'var(--r1)', padding: 'var(--s3)', marginBottom: 'var(--s4)', borderLeft: '3px solid var(--accent)' }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>&#128221; Ma note</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{note}</div>
                <button onClick={() => setShowNote(true)} style={{ marginTop: 4, fontSize: 11, color: 'var(--accent)', background: 'none' }}>Modifier</button>
              </div>
            )}

            {/* Bandeau PR */}
            {isPR && weight > 0 && (
              <div style={{ background: 'linear-gradient(90deg, #ff6f00, #ffa000)', borderRadius: 'var(--r1)', padding: 'var(--s3)', marginBottom: 'var(--s3)', textAlign: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                &#127942; Nouveau record personnel ! {weight}kg
              </div>
            )}

            {/* Tip */}
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--surface-2)', borderRadius: 'var(--r1)', padding: 'var(--s3)', marginBottom: 'var(--s4)', lineHeight: 1.6 }}>
              &#128161; {exercise.tips}
            </div>

            {/* Poids + RPE */}
            <div style={{ display: 'flex', gap: 'var(--s3)', marginBottom: 'var(--s2)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Poids (kg)</label>
                <input type="number" value={weight || ''} onChange={e => onWeightChange(parseFloat(e.target.value) || 0)} placeholder="0" min="0" step="0.5" style={{ marginTop: 4, textAlign: 'center', fontWeight: 700, fontSize: 18 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>RPE (1-10)</label>
                <input type="number" value={rpe || ''} onChange={e => onRpeChange(Math.min(10, Math.max(1, parseInt(e.target.value) || 0)))} placeholder="&mdash;" min="1" max="10" style={{ marginTop: 4, textAlign: 'center', fontWeight: 700, fontSize: 18 }} />
              </div>
            </div>

            {/* 1RM */}
            <OneRMBadge weight={weight} repsMin={exercise.repsMin} repsMax={exercise.repsMax} />

            {/* Alternatives */}
            {exercise.alternatives && exercise.alternatives.length > 0 && (
              <div style={{ marginTop: 'var(--s4)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--s2)' }}>Alternatives</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
                  {exercise.alternatives.map((alt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', background: 'var(--surface-2)', borderRadius: 'var(--r1)', padding: 'var(--s2)' }}>
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

      {/* Overlays / modals */}
      {showOptions && (
        <OptionsMenu
          exercise={exercise}
          isDisabled={isDisabled}
          currentSwap={swappedName}
          note={note}
          onToggleDisable={() => onToggleDisable(exercise.id)}
          onOpenNote={() => setShowNote(true)}
          onOpenSwap={() => setShowSwap(true)}
          onClose={() => setShowOptions(false)}
        />
      )}
      {showNote && (
        <NoteModal
          exerciseId={exercise.id}
          exerciseName={displayName}
          currentNote={note}
          onSave={val => onNoteChange(exercise.id, val)}
          onClose={() => setShowNote(false)}
        />
      )}
      {showSwap && (
        <SwapModal
          exercise={exercise}
          currentSwap={swappedName}
          onSwap={altName => onSwap(exercise.id, altName)}
          onReset={() => onResetSwap(exercise.id)}
          onClose={() => setShowSwap(false)}
        />
      )}
      {lightbox && <Lightbox frames={frames} name={displayName} onClose={() => setLightbox(false)} />}
    </>
  );
}
