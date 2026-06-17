import { useStorage } from '../hooks/useStorage';
import { DEFAULT_OBJECTIVES } from '../data/objectives';
import { WORKOUT_TYPES } from '../data/workout';
import { useStreak } from '../hooks/useStreak';

const TYPE_COLORS = {
  FullA: '#e74c3c',
  FullB: '#3498db',
  FullC: '#27ae60',
  Repos: '#95a5a6',
};

export default function Header({ week, todayType, activeTab }) {
  const [objectives] = useStorage('muscu_objectives', DEFAULT_OBJECTIVES);
  const { streak, badge } = useStreak();

  const activeObj = objectives[0] || null;
  const daysLeft = activeObj?.targetDate
    ? Math.max(0, Math.ceil((new Date(activeObj.targetDate) - new Date()) / 86400000))
    : null;

  const wt = WORKOUT_TYPES[todayType];
  const typeColor = TYPE_COLORS[todayType] || 'var(--accent)';

  const titles = { muscu: 'Muscu Plan', nutrition: 'Nutrition', courses: 'Courses' };

  return (
    <header className="app-header">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px',
          background: `linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {titles[activeTab]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: typeColor,
            flexShrink: 0,
            boxShadow: `0 0 6px ${typeColor}`,
          }} />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
            S{week} &middot; {todayType === 'Repos' ? 'Repos' : `${wt?.emoji} ${todayType}`}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
        {streak > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: streak >= 7
              ? 'linear-gradient(135deg, #fff3e0, #ffe0b2)'
              : 'var(--surface-2)',
            border: `1px solid ${streak >= 7 ? '#ffb300' : 'var(--border)'}`,
            borderRadius: 'var(--r4)',
            padding: '4px 10px',
            fontSize: 12, fontWeight: 700,
            color: streak >= 7 ? '#e65100' : 'var(--text-secondary)',
            boxShadow: streak >= 7 ? '0 2px 8px rgba(255,179,0,0.25)' : 'none',
            transition: 'all 0.3s ease',
          }}>
            <span style={{ fontSize: 14 }}>{badge || '&#128170;'}</span>
            <span>{streak}j</span>
          </div>
        )}

        {activeObj && daysLeft !== null && (
          <div className="countdown-chip" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{activeObj.emoji}</span>
            <span>J-{daysLeft}</span>
          </div>
        )}
      </div>
    </header>
  );
}
