import { useState } from 'react';
import SessionView from './SessionView';
import CalendarView from './CalendarView';
import HistoryView from './HistoryView';
import StatsView from './StatsView';
import ObjectivesPanel from '../Objectives/ObjectivesPanel';
import { useWorkout } from '../../hooks/useWorkout';

const SUB_TABS = [
  { id: 'session',    label: 'Seance',    icon: '▶' },
  { id: 'calendrier', label: 'Calendrier', icon: '📅' },
  { id: 'historique', label: 'Historique', icon: '📋' },
  { id: 'stats',      label: 'Stats',      icon: '📈' },
  { id: 'objectifs',  label: 'Objectifs',  icon: '🎯' },
];

export default function TabMuscu() {
  const [subTab, setSubTab] = useState('session');
  const workout = useWorkout();

  return (
    <div>
      <div className="sub-tab-bar" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            className={`sub-tab ${subTab === t.id ? 'active' : ''}`}
            onClick={() => setSubTab(t.id)}
            dangerouslySetInnerHTML={{ __html: t.icon + ' ' + t.label }}
          />
        ))}
      </div>

      {subTab === 'session'    && <SessionView workout={workout} />}
      {subTab === 'calendrier' && <CalendarView />}
      {subTab === 'historique' && <HistoryView history={workout.history} onDelete={workout.deleteSession} />}
      {subTab === 'stats'      && <StatsView history={workout.history} />}
      {subTab === 'objectifs'  && <ObjectivesPanel />}
    </div>
  );
}
