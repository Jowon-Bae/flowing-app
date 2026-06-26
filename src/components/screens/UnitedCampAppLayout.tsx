import React, { useState } from 'react';
import OutreachPrayerAppScreen from './OutreachPrayerAppScreen';
import UnitedCampDashboardScreen from './UnitedCampDashboardScreen';
import UnitedCampAdminScreen from './UnitedCampAdminScreen';

interface UnitedCampAppLayoutProps {
  teamType: 'outreach' | 'intercessory';
  name: string;
  onBack: () => void;
}

const UnitedCampAppLayout: React.FC<UnitedCampAppLayoutProps> = ({ teamType, name, onBack }) => {
  const [activeTab, setActiveTab] = useState<'prayer' | 'dashboard' | 'admin'>('prayer');

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 relative overflow-hidden">
      <div className="flex-1 w-full h-full relative">
        {activeTab === 'prayer' && <OutreachPrayerAppScreen teamType={teamType} name={name} onBack={onBack} />}
        {activeTab === 'dashboard' && <UnitedCampDashboardScreen teamType={teamType} />}
        {activeTab === 'admin' && <UnitedCampAdminScreen teamType={teamType} onBack={onBack} />}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/85 backdrop-blur-xl border-t border-gray-800 flex z-50 pb-safe">
        <button 
          onClick={() => setActiveTab('prayer')}
          className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${activeTab === 'prayer' ? 'text-primary-300' : 'text-gray-500'}`}
        >
          <span className="text-[22px] mb-0.5">🙏</span>
          <span className="text-[11px] font-medium">기도하기</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${activeTab === 'dashboard' ? 'text-primary-300' : 'text-gray-500'}`}
        >
          <span className="text-[22px] mb-0.5">📊</span>
          <span className="text-[11px] font-medium">현황</span>
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${activeTab === 'admin' ? 'text-primary-300' : 'text-gray-500'}`}
        >
          <span className="text-[22px] mb-0.5">⚙️</span>
          <span className="text-[11px] font-medium">관리</span>
        </button>
      </nav>
    </div>
  );
};

export default UnitedCampAppLayout;
