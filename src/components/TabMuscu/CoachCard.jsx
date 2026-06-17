import { useState } from 'react';

const TYPE_STYLES = {
  success: { bg: 'rgba(76,175,80,0.12)',  border: '#4caf50', text: '#4caf50' },
  warning: { bg: 'rgba(255,152,0,0.12)',  border: '#ff9800', text: '#ff9800' },
  info:    { bg: 'rgba(99,102,241,0.12)', border: 'var(--accent)', text: 'var(--accent)' },
  default: { bg: 'var(--surface-2)',      border: 'var(--border)', text: 'var(--text-secondary)' },
};

function SingleInsight({ insight, onDismiss }) {
  const style = TYPE_STYLES[insight.type] || TYPE_STYLES.default;
  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: 'var(--r2)',
      padding: 'var(--s3) var(--s4)',
      marginBottom: 'var(--s2)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--s3)',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{insight.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: style.text, marginBottom: 2 }}>
          {insight.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {insight.body}
        </div>
      </div>
      <button onClick={() => onDismiss(insight.id)} style={{ fontSize: 14, color: 'var(--text-muted)', background: 'none', padding: 2, flexShrink: 0 }}>
        &#10005;
      </button>
    </div>
  );
}

export default function CoachCard({ insights }) {
  const [dismissed, setDismissed] = useState([]);

  const visible = insights.filter(i => !dismissed.includes(i.id));
  if (visible.length === 0) return null;

  return (
    <div style={{ marginBottom: 'var(--s4)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--s2)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>&#129302;</span> Coach
      </div>
      {visible.map(insight => (
        <SingleInsight
          key={insight.id}
          insight={insight}
          onDismiss={id => setDismissed(prev => [...prev, id])}
        />
      ))}
    </div>
  );
}
