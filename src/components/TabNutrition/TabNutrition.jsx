import { useState } from 'react';
import { NUTRITION_PLAN, DAYS_ORDER, DAILY_TARGETS } from '../../data/nutrition';
import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';
import SupplementTracker from '../TabMuscu/SupplementTracker';
import HydrationTracker from './HydrationTracker';

const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function TabNutrition() {
  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const [selectedDay, setSelectedDay] = useState(DAYS_ORDER[todayIndex]);
  const [log, setLog] = useStorage(STORAGE_KEYS.NUTRITION_LOG, {});

  const todayKey = new Date().toISOString().split('T')[0];
  const dayLog = log[`${todayKey}_${selectedDay}`] || {};
  const plan = NUTRITION_PLAN[selectedDay];

  function toggleMeal(mealId) {
    const key = `${todayKey}_${selectedDay}`;
    setLog(prev => ({
      ...prev,
      [key]: { ...dayLog, [mealId]: !dayLog[mealId] },
    }));
  }

  const eaten = plan.meals.filter(m => dayLog[m.id]);
  const totalKcal = eaten.reduce((s, m) => s + m.kcal, 0);
  const totalProtein = eaten.reduce((s, m) => s + m.protein, 0);

  return (
    <div style={{ padding: 'var(--s4)', paddingBottom: 100 }}>

      {/* Selecteur de jour */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--s4)', overflowX: 'auto' }}>
        {DAYS_ORDER.map((day, i) => {
          const isSelected = day === selectedDay;
          const isToday = i === todayIndex;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                flexShrink: 0,
                padding: '6px 10px',
                borderRadius: 'var(--r2)',
                fontWeight: 600, fontSize: 12,
                background: isSelected ? 'var(--accent)' : 'var(--surface)',
                color: isSelected ? 'white' : isToday ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${isSelected ? 'var(--accent)' : isToday ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {DAY_SHORT[i]}
              {isToday && !isSelected && (
                <span style={{
                  display: 'block', height: 3, width: 3,
                  borderRadius: '50%', background: 'var(--accent)', margin: '2px auto 0',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bilan macro */}
      <div className="card" style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 'var(--s3)' }}>
          Bilan — {selectedDay}
        </div>
        <MacroBar label="Calories" current={totalKcal} target={DAILY_TARGETS.calories} unit="kcal" color="var(--accent)" />
        <MacroBar label="Proteines" current={totalProtein} target={DAILY_TARGETS.protein} unit="g" color="var(--accent-pull)" />
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 'var(--s2)' }}>
          {eaten.length}/{plan.meals.length} repas · Objectif : {plan.totalKcal} kcal / {plan.totalProtein}g prot.
        </div>
      </div>

      {/* Hydratation */}
      <div style={{ marginBottom: 'var(--s4)' }}>
        <HydrationTracker />
      </div>

      {/* Supplements */}
      <div style={{ marginBottom: 'var(--s4)' }}>
        <SupplementTracker />
      </div>

      {/* Repas */}
      {plan.meals.map(meal => {
        const done = !!dayLog[meal.id];
        return (
          <div
            key={meal.id}
            className="card"
            style={{
              marginBottom: 'var(--s3)',
              borderLeft: `3px solid ${done ? 'var(--success)' : 'var(--border)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
              <span style={{ fontSize: 20 }}>{meal.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{meal.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {meal.kcal} kcal · {meal.protein}g prot
                </div>
              </div>
              <button
                onClick={() => toggleMeal(meal.id)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: done ? 'var(--success)' : 'var(--surface-2)',
                  color: done ? 'white' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}
              >
                {done ? '✓' : '○'}
              </button>
            </div>
            <div style={{ marginTop: 'var(--s2)', paddingLeft: 36 }}>
              {meal.items.map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  · {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MacroBar({ label, current, target, unit, color }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div style={{ marginBottom: 'var(--s3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{current}/{target} {unit}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
