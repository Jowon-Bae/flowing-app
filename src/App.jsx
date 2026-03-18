import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Target, MessageCircle } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import './index.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedDayItem, setSelectedDayItem] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);

  // Load completed days from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('passion_week_completed_days');
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing stats");
      }
    }
  }, []);

  const handleCompleteChallenge = (dayNum) => {
    if (!completedDays.includes(dayNum)) {
      const updated = [...completedDays, dayNum];
      setCompletedDays(updated);
      localStorage.setItem('passion_week_completed_days', JSON.stringify(updated));
    }
  };

  const renderContent = () => {
    if (selectedDayItem) {
      return (
        <DetailScreen 
          item={selectedDayItem} 
          onBack={() => setSelectedDayItem(null)} 
          onComplete={handleCompleteChallenge}
          isCompleted={completedDays.includes(selectedDayItem.day)}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return <HomeScreen onSelectDay={setSelectedDayItem} completedDays={completedDays} />;
      case 'meditation':
        return <div style={{padding: 24, textAlign: 'center', marginTop: 100, color: 'var(--text-secondary)'}}>묵상 기록함 (준비중)</div>;
      case 'challenge':
        return <div style={{padding: 24, textAlign: 'center', marginTop: 100, color: 'var(--text-secondary)'}}>나의 챌린지 성취도: {completedDays.length}/6</div>;
      case 'community':
        return <div style={{padding: 24, textAlign: 'center', marginTop: 100, color: 'var(--text-secondary)'}}>소통방 (준비중)</div>;
      default:
        return <HomeScreen onSelectDay={setSelectedDayItem} completedDays={completedDays} />;
    }
  };

  return (
    <div className="app-container">
      
      {/* Dynamic Content Area */}
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>

      {/* Bottom Tab Navigation */}
      {!selectedDayItem && (
        <nav className="bottom-tab-nav">
          <div className={`tab-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')}>
            <Home size={24} />
            <span>홈</span>
          </div>
          <div className={`tab-item ${currentTab === 'meditation' ? 'active' : ''}`} onClick={() => setCurrentTab('meditation')}>
            <BookOpen size={24} />
            <span>묵상</span>
          </div>
          <div className={`tab-item ${currentTab === 'challenge' ? 'active' : ''}`} onClick={() => setCurrentTab('challenge')}>
            <Target size={24} />
            <span>챌린지</span>
          </div>
          <div className={`tab-item ${currentTab === 'community' ? 'active' : ''}`} onClick={() => setCurrentTab('community')}>
            <MessageCircle size={24} />
            <span>소통</span>
          </div>
        </nav>
      )}
    </div>
  );
}
