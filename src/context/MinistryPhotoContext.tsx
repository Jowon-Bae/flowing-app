import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ministry_photos');

      const res = await fetch(`https://api.cloudinary.com/v1_1/dhxwzewoy/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
      
      const url = data.secure_url;
      const storagePath = data.public_id;

      await addDoc(collection(db, 'ministryPhotos'), {
        ministryId,
        url,
        storagePath,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error uploading photo:', e);
      alert('사진 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (_ministryId: string, photoId: string, _storagePath: string) => {
    try {
      // Delete document from Firestore so it doesn't show in the app.
      // Note: Cloudinary doesn't support unsigned client-side deletions for security.
      await deleteDoc(doc(db, 'ministryPhotos', photoId));
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
