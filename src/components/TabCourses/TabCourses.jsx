import { useState } from 'react';
import { GROCERY_PASSAGES, getShoppingCalendar } from '../../data/groceries';
import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';

export default function TabCourses() {
  const calendar = getShoppingCalendar();
  const today = new Date().toISOString().split('T')[0];
  const todayPassage = calendar.find(p => p.date === today) ||
    calendar.find(p => p.date > today) || calendar[calendar.length - 1];

  const [selectedPassage, setSelectedPassage] = useState(todayPassage?.index || 1);
  const [checked, setChecked] = useStorage(STORAGE_KEYS.GROCERY_CHECKED, {});

  const passage = calendar.find(p => p.index === selectedPassage);
  const passageData = passage ? GROCERY_PASSAGES[passage.type] : null;
  const passageKey = `passage_${selectedPassage}`;
  const passageChecked = checked[passageKey] || {};

  function toggleItem(itemId) {
    setChecked(prev => ({
      ...prev,
      [passageKey]: { ...passageChecked, [itemId]: !passageChecked[itemId] },
    }));
  }

  function resetPassage() {
    setChecked(prev => ({ ...prev, [passageKey]: {} }));
  }

  // Calcul budget réel
  let totalPrice = 0;
  if (passageData) {
    passageData.sections.forEach(s => {
      s.items.forEach(item => {
        if (passageChecked[item.id]) totalPrice += item.price;
      });
    });
  }

  const allItems = passageData?.sections.flatMap(s => s.items) || [];
  const totalItems = allItems.length;
  const checkedItems = allItems.filter(i => passageChecked[i.id]).length;

  return (
    <div style={{ padding: 'var(--s4)' }}>
      {/* Sélecteur de passage */}
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--s2)' }}>
          Passage du programme (tous les 3 jours)
        </div>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
          {calendar.map(p => {
            const isToday = p.date === today;
            const isPast = p.date < today;
            const isSelected = p.index === selectedPassage;
            return (
              <button
                key={p.index}
                onClick={() => setSelectedPassage(p.index)}
                style={{
                  flexShrink: 0,
                  padding: '6px 10px',
                  borderRadius: 'var(--r1)',
                  fontSize: 11, fontWeight: 600,
                  background: isSelected ? 'var(--accent)' : 'var(--surface)',
                  color: isSelected ? 'white' : isPast ? 'var(--text-muted)' : 'var(--text-secondary)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : isToday ? 'var(--accent)' : 'var(--border)'}`,
                  opacity: isPast && !isSelected ? 0.6 : 1,
                  textAlign: 'center',
                }}
              >
                <div>P{p.index}</div>
                <div style={{ fontSize: 9 }}>
                  {new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {passageData && (
        <>
          {/* En-tête passage */}
          <div className="card" style={{ marginBottom: 'var(--s4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>
                  Passage {selectedPassage} — {passageData.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {passage?.date} · Budget estimé : {passageData.budget}
                </div>
              </div>
              <button
                onClick={resetPassage}
                style={{ fontSize: 12, color: 'var(--text-muted)',
                  padding: '4px 8px', background: 'var(--surface-2)', borderRadius: 'var(--r1)' }}
              >
                Reset
              </button>
            </div>

            {/* Progress */}
            <div className="progress-bar" style={{ marginTop: 'var(--s3)', marginBottom: 'var(--s2)' }}>
              <div className="progress-fill" style={{
                width: `${totalItems ? (checkedItems / totalItems) * 100 : 0}%`,
                background: 'var(--success)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>{checkedItems}/{totalItems} articles</span>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>

          {/* Sections */}
          {passageData.sections.map(section => (
            <div key={section.name} style={{ marginBottom: 'var(--s4)' }}>
              <div className="section-header">{section.emoji} {section.name}</div>
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--r2)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {section.items.map((item, i) => {
                  const done = !!passageChecked[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        padding: 'var(--s3) var(--s4)',
                        gap: 'var(--s3)',
                        borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                        background: done ? '#f0fdf4' : 'transparent',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 4, flexShrink: 0,
                        background: done ? 'var(--success)' : 'var(--surface-2)',
                        border: `1px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 13,
                      }}>
                        {done ? '✓' : ''}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{
                          fontSize: 14, fontWeight: 500,
                          color: done ? 'var(--text-muted)' : 'var(--text)',
                          textDecoration: done ? 'line-through' : 'none',
                        }}>
                          {item.name}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>
                          {item.qty}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {item.price.toFixed(2)} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
