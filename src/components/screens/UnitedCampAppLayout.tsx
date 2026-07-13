import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BarChart2, Settings } from 'lucide-react';
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
        {activeTab === 'dashboard' && <UnitedCampDashboardScreen teamType={teamType} name={name} />}
        {activeTab === 'admin' && <UnitedCampAdminScreen teamType={teamType} onBack={onBack} />}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50">
        {[
          { id: 'prayer', label: '기도하기', icon: Heart },
          { id: 'dashboard', label: '현황', icon: BarChart2 },
          { id: 'admin', label: '관리', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'prayer' | 'dashboard' | 'admin')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
                isActive ? 'text-slate-700' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon size={24} strokeWidth={isActive ? 2 : 1.75} />
              </motion.div>
              <span className={`text-[11px] mt-1.5 font-medium transition-opacity ${isActive ? 'opacity-100 font-bold' : 'opacity-80'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UnitedCampAppLayout;
