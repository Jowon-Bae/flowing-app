import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AnalyticsTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let uid = localStorage.getItem('flowing_app_uid');
        let isNewUser = false;

        if (!uid) {
          uid = uuidv4();
          localStorage.setItem('flowing_app_uid', uid);
          isNewUser = true;
        }

        const today = getLocalDateString();
        const lastVisitDate = localStorage.getItem('flowing_app_last_visit');

        // Track Unique Visitor (Total User)
        const visitorRef = doc(db, 'visitors', uid);
        if (isNewUser) {
          await setDoc(visitorRef, {
            createdAt: serverTimestamp(),
            lastVisit: serverTimestamp()
          });
        } else if (lastVisitDate !== today) {
          // Update last visit time if it's a new day
          await updateDoc(visitorRef, {
            lastVisit: serverTimestamp()
          }).catch(() => {
            // Ignore error if document was deleted manually in db
          });
        }

        // Track Daily Attendance (only once per day per user)
        if (lastVisitDate !== today) {
          const dailyVisitRef = doc(db, 'visits', `${uid}_${today}`);
          await setDoc(dailyVisitRef, {
            uid: uid,
            date: today,
            timestamp: serverTimestamp()
          });
          localStorage.setItem('flowing_app_last_visit', today);
        }

      } catch (error) {
        console.error("Failed to track analytics:", error);
      }
    };

    trackVisit();
  }, []);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
