import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { useProfileData } from './useProfileData';
import { db } from '../lib/firebase';
import type { Advertisement } from '../types/advertisement';

export function useAdvertisements() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const userType = useAuthStore(state => state.userType);
  const { profileData } = useProfileData();

  const fetchAds = useCallback(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      let q = query(collection(db, 'advertisements'));

      if (userType === 'business') {
        q = query(
          collection(db, 'advertisements'),
          where('businessId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      } else if (userType === 'influencer' && profileData?.location) {
        q = query(
          collection(db, 'advertisements'),
          where('location', '==', profileData.location),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const adsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Advertisement[];
        
        setAds(adsData);
        setError(null);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching ads:', err);
        setError('Failed to fetch advertisements');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up ads listener:', err);
      setError('Failed to load advertisements');
      setLoading(false);
    }
  }, [user?.uid, userType, profileData?.location]);

  useEffect(() => {
    const unsubscribe = fetchAds();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAds]);

  return { ads, loading, error, refetch: fetchAds };
}