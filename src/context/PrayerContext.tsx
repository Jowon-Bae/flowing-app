import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Prayer {
  id: string;
  author: string;
  time: string;
  content: string;
  amenCount: number;
  createdAt: any;
}

interface PrayerContextType {
  prayers: Prayer[];
  addPrayer: (author: string, content: string) => void;
  deletePrayer: (id: string) => void;
  incrementAmen: (id: string) => void;
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

export const PrayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prayersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prayer[];
      setPrayers(prayersData);
    }, (error) => {
      console.error("Error fetching prayers:", error);
    });

    return () => unsubscribe();
  }, []);

  const addPrayer = async (author: string, content: string) => {
    try {
      await addDoc(collection(db, 'prayers'), {
        author,
        content,
        time: '방금 전', // We could calculate this from createdAt if we want later
        amenCount: 0,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deletePrayer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'prayers', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const incrementAmen = async (id: string) => {
    try {
      await updateDoc(doc(db, 'prayers', id), {
        amenCount: increment(1)
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const getStats = () => {
    const totalPrayers = prayers.length;
    const totalAmens = prayers.reduce((sum, current) => sum + (current.amenCount || 0), 0);
    return { totalPrayers, totalAmens };
  };

  return (
    <PrayerContext.Provider value={{ prayers, addPrayer, deletePrayer, incrementAmen, getStats }}>
      {children}
    </PrayerContext.Provider>
  );
};
