import React, { useState, useEffect } from 'react';
import { Home, Calendar, HeartHandshake, Heart, Music, Music4 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Icons for navigation

// Screens
import SplashScreen from './components/screens/SplashScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import HomeScreen from './components/screens/HomeScreen';
import ScheduleScreen from './components/screens/ScheduleScreen';
import GivingScreen from './components/screens/GivingScreen';
import PrayerScreen from './components/screens/PrayerScreen';
import AdminScreen from './components/screens/AdminScreen';

import { PrayerProvider } from './context/PrayerContext';

type Tab = 'home' | 'schedule' | 'giving' | 'prayer' | 'admin';

const tabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'schedule', label: '사역 일정', icon: Calendar },
  { id: 'giving', label: '후원', icon: HeartHandshake },
  { id: 'prayer', label: '중보기도', icon: Heart },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = document.getElementById('global-bgm') as HTMLAudioElement;
    if (audio) {
      if (!showOnboarding && isPlayingBgm) {
        audio.play().catch(e => console.log('BGM Play prevented:', e));
      } else {
        audio.pause();
      }
    }
  }, [showOnboarding, isPlayingBgm]);

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
    setIsPlayingBgm(true); // Auto-start music when starting the app
  };

  return (
    <PrayerProvider>
      <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
      {/* Full Screen Mobile Container */}
      <div className="w-full max-w-[480px] min-h-[100dvh] bg-white overflow-hidden relative flex flex-col shadow-sm">
        
        <AnimatePresence mode="wait">
          {loading ? (
            <SplashScreen key="splash" />
          ) : showOnboarding ? (
            <OnboardingScreen key="onboarding" onFinish={handleFinishOnboarding} />
          ) : (
            <motion.div 
              key="main-app" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full relative"
            >
              {/* Global Audio Element */}
              <audio id="global-bgm" src={`${import.meta.env.BASE_URL}bgm.mp3`} loop />

              {/* Global BGM Toggle Button */}
              <button 
                onClick={() => setIsPlayingBgm(!isPlayingBgm)}
                className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-gray-100/50 flex items-center justify-center text-primary-600 transition active:scale-95"
              >
                {isPlayingBgm ? <Music size={16} /> : <Music4 size={16} className="opacity-50" />}
              </button>

              <div className="flex-1 overflow-y-auto w-full no-scrollbar h-full bg-background relative pb-[80px] pt-14">
                <AnimatePresence mode="wait">
                  {activeTab === 'home' && <HomeScreen key="home" onOpenAdmin={() => setActiveTab('admin')} />}
                  {activeTab === 'schedule' && <ScheduleScreen key="schedule" />}
                  {activeTab === 'giving' && <GivingScreen key="giving" />}
                  {activeTab === 'prayer' && <PrayerScreen key="prayer" />}
                  {activeTab === 'admin' && <AdminScreen key="admin" onClose={() => setActiveTab('home')} />}
                </AnimatePresence>
              </div>

              {/* Bottom Navigation Navigation */}
              <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex items-center justify-around px-2 z-50 rounded-b-[32px]">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                        isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={{ 
                          y: isActive ? -4 : 0,
                          scale: isActive ? 1.1 : 1 
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      </motion.div>
                      <span className={`text-[10px] mt-1 font-medium transition-opacity ${isActive ? 'opacity-100 font-semibold' : 'opacity-70'}`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </PrayerProvider>
  );
}

export default App;
