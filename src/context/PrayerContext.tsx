import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Prayer {
  id: number;
  author: string;
  time: string;
  content: string;
  amenCount: number;
}

interface PrayerContextType {
  prayers: Prayer[];
  addPrayer: (author: string, content: string) => void;
  deletePrayer: (id: number) => void;
  incrementAmen: (id: number) => void;
  getStats: () => { totalPrayers: number; totalAmens: number };
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const usePrayerContext = () => {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error('usePrayerContext must be used within a PrayerProvider');
  }
  return context;
};

const defaultPrayers: Prayer[] = [
  {
    id: 1,
    author: '선교팀 리더',
    time: '2시간 전',
    content: '내일 첫 사역인 A마을 어린이 성경학교를 위해 출발합니다. 아이들의 마음 문이 열리고, 안전하게 일정이 진행될 수 있도록 기도해 주세요.',
    amenCount: 142,
  },
  {
    id: 2,
    author: '선교팀 총무',
    time: '5시간 전',
    content: '현지 도착 후 비가 많이 내리고 있습니다. 내일 야외 사역을 위해 좋은 날씨를 허락해 주시기를 기도 부탁드립니다.',
    amenCount: 385,
  },
  {
    id: 3,
    author: '현지 선교사',
    time: '어제',
    content: '이번 아웃리치를 통해 이 지역 단기 선교의 문이 크게 열릴 것으로 기대합니다. 팀원들의 영육 간의 강건함을 위해 기도합니다.',
    amenCount: 512,
  }
];

export const PrayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prayers, setPrayers] = useState<Prayer[]>(defaultPrayers);

  const addPrayer = (author: string, content: string) => {
    const newPrayer: Prayer = {
      id: Date.now(),
      author,
      content,
      time: '방금 전',
      amenCount: 0
    };
    setPrayers(prev => [newPrayer, ...prev]);
  };

  const deletePrayer = (id: number) => {
    setPrayers(prev => prev.filter(p => p.id !== id));
  };

  const incrementAmen = (id: number) => {
    setPrayers(prev => prev.map(p => 
      p.id === id ? { ...p, amenCount: p.amenCount + 1 } : p
    ));
  };

  const getStats = () => {
    const totalPrayers = prayers.length;
    const totalAmens = prayers.reduce((sum, current) => sum + current.amenCount, 0);
    return { totalPrayers, totalAmens };
  };

  return (
    <PrayerContext.Provider value={{ prayers, addPrayer, deletePrayer, incrementAmen, getStats }}>
      {children}
    </PrayerContext.Provider>
  );
};
