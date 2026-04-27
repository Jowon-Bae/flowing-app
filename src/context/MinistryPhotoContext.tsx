import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export interface MinistryPhoto {
  id: string;
  ministryId: string;
  url: string;
  storagePath: string;
  createdAt: any;
}

interface MinistryPhotoContextType {
  photos: Record<string, MinistryPhoto[]>; // keyed by ministryId
  uploadPhoto: (ministryId: string, file: File) => Promise<void>;
  deletePhoto: (ministryId: string, photoId: string, storagePath: string) => Promise<void>;
  uploading: boolean;
}

const MinistryPhotoContext = createContext<MinistryPhotoContextType | undefined>(undefined);

export const useMinistryPhotoContext = () => {
  const context = useContext(MinistryPhotoContext);
  if (!context) throw new Error('useMinistryPhotoContext must be used within a MinistryPhotoProvider');
  return context;
};

export const MinistryPhotoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Record<string, MinistryPhoto[]>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'ministryPhotos'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const grouped: Record<string, MinistryPhoto[]> = {};
      snapshot.docs.forEach((d) => {
        const data = { id: d.id, ...d.data() } as MinistryPhoto;
        if (!grouped[data.ministryId]) grouped[data.ministryId] = [];
        grouped[data.ministryId].push(data);
      });
      setPhotos(grouped);
    });
    return () => unsubscribe();
  }, []);

  const uploadPhoto = async (ministryId: string, file: File) => {
    setUploading(true);
    try {
      const storagePath = `ministryPhotos/${ministryId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'ministryPhotos'), {
        ministryId,
        url,
        storagePath,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error uploading photo:', e);
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (_ministryId: string, photoId: string, storagePath: string) => {
    try {
      await deleteDoc(doc(db, 'ministryPhotos', photoId));
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (e) {
      console.error('Error deleting photo:', e);
    }
  };

  return (
    <MinistryPhotoContext.Provider value={{ photos, uploadPhoto, deletePhoto, uploading }}>
      {children}
    </MinistryPhotoContext.Provider>
  );
};
