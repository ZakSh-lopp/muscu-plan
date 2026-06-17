import { useStorage, STORAGE_KEYS } from '../../hooks/useStorage';
import { PROGRAM_START, DAY_TYPES, WORKOUT_TYPES } from '../../data/workout';

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function getProgramDay(date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  const s = new Date(PROGRAM_START); s.setHours(0,0,0,0);
  const idx = Math.floor((d - s) / 86400000);
  if (idx < 0 || idx > 45) return null;
  return { idx, type: DAY_TYPES[idx % 7] };
}

export default function CalendarView() {
  const [history] = useStorage(STORAGE_KEYS.WORKOUT_HISTORY, []);
  const today = new Date(); today.setHours(0,0,0,0);

  // Générer juin + juillet 2026
  const months = [
    { year: 2026, month: 5 }, // juin
    { year: 2026, month: 6 }, // juillet
  ];

  const historyDates = new Set(history.map(h => h.date));

  return (
    <div style={{ padding: 'var(--s4)', paddingBottom: 'calc(var(--tab-height) + env(safe-area-inset-bottom) + 24px)' }}>

      {/* Légende */}
      <div style={{ display: 'flex', gap: 'var(--s3)', marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
        {Object.entries(WORKOUT_TYPES).map(([type, wt]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: wt.color, display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{wt.emoji} {type}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#dcfce7', border: '1px solid #16a34a', display: 'inline-block' }} />
          <span style={{ color: 'var(--text-secondary)' }}>✓ Fait</span>
        </div>
      </div>

      {months.map(({ year, month }) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        // Lundi = 0, décalage
        let startOffset = firstDay.getDay() - 1;
        if (startOffset < 0) startOffset = 6;

        const days = [];
        // Cellules vides avant
        for (let i = 0; i < startOffset; i++) days.push(null);
        // Jours du mois
        for (let d = 1; d <= lastDay.getDate(); d++) {
          days.push(new Date(year, month, d));
        }

        return (
          <div key={`${year}-${month}`} style={{ marginBottom: 'var(--s5)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 'var(--s3)' }}>
              {MONTHS_FR[month]} {year}
            </div>

            {/* Entêtes jours */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 3 }}>
              {DAYS_FR.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '2px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              {days.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} />;

                const dateStr = date.toISOString().split('T')[0];
                const isToday = date.getTime() === today.getTime();
                const isPast = date < today;
                const isFuture = date > today;
                const progDay = getProgramDay(date);
                const isDone = historyDates.has(dateStr);
                const wt = progDay ? WORKOUT_TYPES[progDay.type] : null;
                const isRest = progDay?.type === 'Repos';
                const isOutOfProgram = !progDay;

                let bg = 'var(--surface)';
                let border = '1px solid var(--border)';
                let textColor = 'var(--text)';
                let opacity = 1;

                if (isDone) {
                  bg = '#dcfce7'; border = '1px solid #16a34a';
                } else if (isToday) {
                  bg = wt?.color || 'var(--accent)'; border = `2px solid ${wt?.color || 'var(--accent)'}`;
                  textColor = 'white';
                } else if (isRest && !isDone) {
                  bg = 'var(--surface-2)';
                } else if (isOutOfProgram) {
                  opacity = 0.3;
                } else if (isPast && !isDone && progDay) {
                  bg = 'var(--surface-2)'; opacity = 0.55;
                }

                return (
                  <div key={dateStr} style={{
                    borderRadius: 6,
                    padding: '5px 2px',
                    textAlign: 'center',
                    background: bg,
                    border,
                    opacity,
                    minHeight: 44,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {/* Numéro du jour */}
                    <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 600, color: isToday ? 'white' : textColor }}>
                      {date.getDate()}
                    </div>
                    {/* Emoji séance */}
                    {progDay && (
                      <div style={{ fontSize: 13, lineHeight: 1, filter: (isPast && !isDone && !isToday) ? 'grayscale(1)' : 'none' }}>
                        {isDone ? '✓' : isRest ? '😴' : wt?.emoji}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Stats rapides */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 'var(--s3)' }}>📊 Résumé</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--s3)' }}>
          <StatBox label="Séances faites" value={history.length} />
          <StatBox label="Séances prévues" value={46 - 7} emoji="📅" />
          <StatBox label="PRs total" value={history.reduce((n, h) => n + (Object.keys(h.weights||{}).length > 0 ? 1 : 0), 0)} emoji="🏆" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, emoji }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}
