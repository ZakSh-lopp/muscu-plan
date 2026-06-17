import { useState } from 'react';
import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';
import { DEFAULT_OBJECTIVES } from '../../data/objectives';

export default function ObjectivesPanel() {
  const [objectives, setObjectives] = useStorage('muscu_objectives', DEFAULT_OBJECTIVES);
  const [weightRecords] = useStorage(STORAGE_KEYS.WEIGHT_RECORDS, []);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ emoji: '🎯', title: '', description: '', targetDate: '', targetWeight: '' });

  const currentWeight = weightRecords.length > 0
    ? weightRecords[weightRecords.length - 1].weight
    : 47;
  const START_WEIGHT = 47;

  function addObjective() {
    if (!form.title) return;
    const newObj = {
      id: `obj_${Date.now()}`,
      emoji: form.emoji,
      title: form.title,
      description: form.description,
      targetDate: form.targetDate || null,
      targetWeight: parseFloat(form.targetWeight) || null,
      locked: false,
    };
    setObjectives(prev => [...prev, newObj]);
    setForm({ emoji: '🎯', title: '', description: '', targetDate: '', targetWeight: '' });
    setShowAdd(false);
  }

  function removeObjective(id) {
    setObjectives(prev => prev.filter(o => o.id !== id || o.locked));
  }

  return (
    <div style={{ padding: 'var(--s4)', paddingBottom: 'calc(var(--tab-height) + env(safe-area-inset-bottom) + 24px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s4)' }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>🎯 Mes objectifs</div>
        <button onClick={() => setShowAdd(v => !v)} style={{
          background: 'var(--accent)', color: 'white',
          padding: '6px 14px', borderRadius: 'var(--r4)',
          fontWeight: 700, fontSize: 13,
        }}>+ Ajouter</button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 'var(--s4)', border: '2px solid var(--accent)' }}>
          <div style={{ fontWeight: 700, marginBottom: 'var(--s3)' }}>Nouvel objectif</div>
          <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s3)' }}>
            <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              style={{ width: 50, textAlign: 'center', fontSize: 20 }} maxLength={2} />
            <input placeholder="Nom de l'objectif *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ flex: 1 }} />
          </div>
          <input placeholder="Description (optionnel)" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ marginBottom: 'var(--s2)' }} />
          <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s3)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Date cible</div>
              <input type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Poids cible (kg)</div>
              <input type="number" placeholder="ex: 55" value={form.targetWeight}
                onChange={e => setForm(f => ({ ...f, targetWeight: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--s2)' }}>
            <button className="btn-primary" onClick={addObjective}>Créer</button>
            <button className="btn-secondary" onClick={() => setShowAdd(false)}>Annuler</button>
          </div>
        </div>
      )}

      {objectives.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--s6)', color: 'var(--text-secondary)', fontSize: 14 }}>
          Pas encore d'objectif. Ajoutes-en un pour te donner une direction !
        </div>
      )}

      {objectives.map((obj, i) => {
        const isActive = i === 0;
        const daysLeft = obj.targetDate
          ? Math.max(0, Math.ceil((new Date(obj.targetDate) - new Date()) / 86400000))
          : null;
        const weightProgress = obj.targetWeight
          ? Math.min(100, Math.max(0, ((currentWeight - START_WEIGHT) / (obj.targetWeight - START_WEIGHT)) * 100))
          : null;
        const isReached = obj.targetWeight ? currentWeight >= obj.targetWeight : false;

        return (
          <div key={obj.id} className="card" style={{
            marginBottom: 'var(--s3)',
            border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
            opacity: isReached ? 0.75 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s3)' }}>
              <span style={{ fontSize: 28, lineHeight: 1, marginTop: 2 }}>{obj.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{obj.title}</span>
                  {isActive && !isReached && (
                    <span className="badge" style={{ background: '#fde8e8', color: 'var(--accent)' }}>En cours</span>
                  )}
                  {isReached && (
                    <span className="badge" style={{ background: '#dcfce7', color: 'var(--success)' }}>✓ Atteint !</span>
                  )}
                </div>
                {obj.description && (
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{obj.description}</div>
                )}
                <div style={{ display: 'flex', gap: 'var(--s3)', marginTop: 'var(--s2)', flexWrap: 'wrap' }}>
                  {daysLeft !== null && (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      📅 {daysLeft > 0 ? `J-${daysLeft}` : "Aujourd'hui !"}
                    </span>
                  )}
                  {obj.targetWeight && (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      ⚖️ {currentWeight} → {obj.targetWeight} kg
                    </span>
                  )}
                </div>
                {weightProgress !== null && (
                  <div style={{ marginTop: 'var(--s2)' }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${weightProgress}%`,
                        background: isReached ? 'var(--success)' : 'var(--accent)',
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {weightProgress.toFixed(0)}% atteint
                    </div>
                  </div>
                )}
              </div>
              {!obj.locked && (
                <button onClick={() => removeObjective(obj.id)}
                  style={{ color: 'var(--text-muted)', fontSize: 20, padding: 4, flexShrink: 0, lineHeight: 1 }}>
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
