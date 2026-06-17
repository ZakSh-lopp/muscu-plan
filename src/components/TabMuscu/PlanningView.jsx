import { PROGRAM_START, DAY_TYPES, WORKOUT_TYPES } from '../../data/workout';

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function PlanningView() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Générer les 46 jours du programme
  const days = Array.from({ length: 46 }, (_, i) => {
    const d = new Date(PROGRAM_START);
    d.setDate(d.getDate() + i);
    const type = DAY_TYPES[i % 7];
    const wt = WORKOUT_TYPES[type];
    const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    const isPast = d < today;
    const week = Math.floor(i / 7) + 1;
    return { date: d, type, wt, isToday, isPast, week, dayIndex: i };
  });

  // Grouper par semaine
  const weeks = [];
  for (let w = 1; w <= 7; w++) {
    weeks.push(days.filter(d => d.week === w));
  }

  return (
    <div style={{ padding: 'var(--s4)' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--s4)' }}>
        12 juin → 26 juillet 2026 · Programme 6j/7
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} style={{ marginBottom: 'var(--s4)' }}>
          <div className="section-header">Semaine {wi + 1}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {DAY_NAMES.map((name, di) => (
              <div key={di} style={{
                textAlign: 'center', fontSize: 10,
                color: 'var(--text-muted)', fontWeight: 600,
                paddingBottom: 2,
              }}>
                {name}
              </div>
            ))}
            {week.map((day, di) => {
              const color = day.wt?.color || '#95a5a6';
              return (
                <div
                  key={di}
                  style={{
                    borderRadius: 'var(--r1)',
                    padding: '6px 2px',
                    textAlign: 'center',
                    background: day.isToday ? color : day.isPast ? 'var(--surface-2)' : 'var(--surface)',
                    border: `1px solid ${day.isToday ? color : 'var(--border)'}`,
                    opacity: day.isPast ? 0.5 : 1,
                  }}
                >
                  <div style={{
                    fontSize: 14,
                    filter: day.isPast ? 'grayscale(1)' : 'none',
                  }}>
                    {day.type === 'Repos' ? '😴' : day.wt?.emoji}
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: day.isToday ? 'white' : 'var(--text-secondary)',
                    marginTop: 1,
                  }}>
                    {day.date.getDate()}/{day.date.getMonth() + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
