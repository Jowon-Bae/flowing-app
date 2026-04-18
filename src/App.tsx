import React, { useState, useEffect } from 'react';
import { Home, Calendar, BookOpen, Newspaper, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import SplashScreen from './components/screens/SplashScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import HomeScreen from './components/screens/HomeScreen';
import MinistryScreen from './components/screens/MinistryScreen';
import MinistryContentScreen from './components/screens/MinistryContentScreen';
import NewsScreen from './components/screens/NewsScreen';
import PrayerScreen from './components/screens/PrayerScreen';
import AdminScreen from './components/screens/AdminScreen';

import { PrayerProvider } from './context/PrayerContext';
import { NewsProvider } from './context/NewsContext';

type Tab = 'home' | 'schedule' | 'ministry-content' | 'news' | 'prayer' | 'admin';

const mainTabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'home',             label: 'Home',    icon: Home },
  { id: 'schedule',         label: '사역 일정', icon: Calendar },
  { id: 'ministry-content', label: '사역 내용', icon: BookOpen },
  { id: 'news',             label: '현장 소식', icon: Newspaper },
  { id: 'prayer',           label: '중보기도', icon: Heart },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };

  // Auto-switch between BGM and home video based on active tab
  useEffect(() => {
    if (showOnboarding) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (activeTab === 'home') {
      // Home tab: pause BGM so video audio takes over
      audio.pause();
    } else {
      // Other tabs: play BGM
      audio.play().catch(e => console.log('BGM play error:', e));
    }
  }, [activeTab, showOnboarding]);

  const handleOpenAdmin = () => {
    setIsAdmin(true);
    setActiveTab('admin');
  };

  const handleCloseAdmin = () => {
    setIsAdmin(false);
    setActiveTab('home');
  };

  // Swipe Gesture Handling
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };
  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minSwipeDistance) {
      if (activeTab === 'admin') return;
      const currentIndex = mainTabs.findIndex(t => t.id === activeTab);
      if (currentIndex === -1) return;
      if (distanceX > minSwipeDistance && currentIndex < mainTabs.length - 1) {
        setActiveTab(mainTabs[currentIndex + 1].id);
      }
      if (distanceX < -minSwipeDistance && currentIndex > 0) {
        setActiveTab(mainTabs[currentIndex - 1].id);
      }
    }
  };

  return (
    <PrayerProvider>
      <NewsProvider>
        <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
          {/* Global Audio */}
          <audio ref={audioRef} id="global-bgm" preload="auto" loop playsInline>
            <source src={`${import.meta.env.BASE_URL}always_music.mp3`} type="audio/mpeg" />
          </audio>

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
                  {/* Content */}
                  <div
                    className="flex-1 overflow-y-auto w-full no-scrollbar h-full bg-background relative pb-[80px]"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEndEvent}
                  >
                    <AnimatePresence mode="wait">
                      {activeTab === 'home' && <HomeScreen key="home" onOpenAdmin={handleOpenAdmin} isActive={activeTab === 'home'} />}
                      {activeTab === 'schedule' && <MinistryScreen key="schedule" />}
                      {activeTab === 'ministry-content' && <MinistryContentScreen key="ministry-content" />}
                      {activeTab === 'news' && <NewsScreen key="news" isAdmin={isAdmin} />}
                      {activeTab === 'prayer' && <PrayerScreen key="prayer" />}
                      {activeTab === 'admin' && <AdminScreen key="admin" onClose={handleCloseAdmin} />}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex items-center justify-around px-2 z-50 rounded-b-[32px]">
                    {mainTabs.map((tab) => {
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
                            animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.1 : 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
      </NewsProvider>
    </PrayerProvider>
  );
}

export default App;
