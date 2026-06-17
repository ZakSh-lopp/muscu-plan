import { useState } from 'react';
import SessionView from './SessionView';
import CalendarView from './CalendarView';
import HistoryView from './HistoryView';
import StatsView from './StatsView';
import ObjectivesPanel from '../Objectives/ObjectivesPanel';
import { useWorkout } from '../../hooks/useWorkout';

const SUB_TABS = [
  { id: 'session',    label: 'Seance',    icon: '&#9654;' },
  { id: 'calendrier', label: 'Calendrier', icon: '&#128197;' },
  { id: 'historique', label: 'Historique', icon: '&#128203;' },
  { id: 'stats',      label: 'Stats',      icon: '&#128200;' },
  { id: 'objectifs',  label: 'Objectifs',  icon: '&#127919;' },
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
      {subTab === 'historique' && <HistoryView history={workout.history} />}
      {subTab === 'stats'      && <StatsView history={workout.history} />}
      {subTab === 'objectifs'  && <ObjectivesPanel />}
    </div>
  );
}
