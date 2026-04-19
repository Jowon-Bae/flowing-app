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

const defaultPrayers: Prayer[] = [];

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
