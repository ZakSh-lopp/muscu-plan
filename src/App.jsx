import { useState, useRef } from 'react';
import TabMuscu from './components/TabMuscu/TabMuscu';
import TabNutrition from './components/TabNutrition/TabNutrition';
import TabCourses from './components/TabCourses/TabCourses';
import Header from './components/Header';
import UpdateBanner from './components/UpdateBanner';
import { getProgramWeek, getTodayWorkoutType } from './hooks/useWorkout';
import { useAppUpdate } from './hooks/useAppUpdate';

const TABS = [
  { id: 'muscu',     label: 'Muscu',    icon: '🏋️' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥑' },
  { id: 'courses',   label: 'Courses',   icon: '🛒' },
];

function PageWrapper({ children, tabId }) {
  const key = useRef(0);
  const prevId = useRef(tabId);
  if (prevId.current !== tabId) {
    key.current += 1;
    prevId.current = tabId;
  }
  return (
    <div key={key.current} className="page-enter" style={{ height: '100%' }}>
      {children}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('muscu');
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const week = getProgramWeek();
  const todayType = getTodayWorkoutType();
  const update = useAppUpdate();

  function switchTab(id) {
    if (id !== activeTab) setActiveTab(id);
  }

  return (
    <div className="app-layout">
      {!updateDismissed && (
        <UpdateBanner update={update} onDismiss={() => setUpdateDismissed(true)} />
      )}

      <Header week={week} todayType={todayType} activeTab={activeTab} />

      <main className="app-content">
        <PageWrapper tabId={activeTab}>
          {activeTab === 'muscu'     && <TabMuscu />}
          {activeTab === 'nutrition' && <TabNutrition />}
          {activeTab === 'courses'   && <TabCourses />}
        </PageWrapper>
      </main>

      <nav className="app-tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => switchTab(tab.id)}
          >
            <span
              className="tab-icon"
              dangerouslySetInnerHTML={{ __html: tab.icon }}
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
