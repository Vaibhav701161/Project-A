import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { useProfileData } from './useProfileData';
import { db } from '../lib/firebase';
import type { Advertisement } from '../types/advertisement';

// Helper (keep for potential future use)
const normalizeDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) { 
      return date;
    }
  }
  console.warn('[normalizeDate] Failed to normalize date, returning epoch:', timestamp);
  return new Date(0); 
};

export function useAdvertisements() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  // No longer need userType or profileData for this simplified fetch

  const fetchAds = useCallback(() => {
    console.log('[useAdvertisements Simplified] fetchAds triggered.');
    if (!user?.uid) { // Still need user to be logged in generally
      console.log('[useAdvertisements Simplified] No user.uid found, aborting fetch.');
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Simplest possible query: Get all documents in the collection
      console.log('[useAdvertisements Simplified] Building simplest query: all advertisements.');
      const q = query(collection(db, 'advertisements'));

      console.log('[useAdvertisements Simplified] Setting up Firestore listener...');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log(`[useAdvertisements Simplified] Snapshot received. ${snapshot.empty ? 'EMPTY' : snapshot.docs.length + ' docs found.'}`);
        
        // Basic mapping, no filtering or complex sorting here
        let rawAdsData: Advertisement[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Advertisement[]; 

        console.log('[useAdvertisements Simplified] Raw data being set to state:', rawAdsData);
        setAds(rawAdsData); // Set whatever came back
        setError(null); 
        setLoading(false);
      }, (err) => {
        console.error('[useAdvertisements Simplified] Firestore onSnapshot error:', err);
        setError(`Failed to fetch advertisements: ${err.code || err.message}`);
        setLoading(false);
      });

      return () => {
        console.log('[useAdvertisements Simplified] Unsubscribing Firestore listener.');
        unsubscribe();
      };
    } catch (err) {
      console.error('[useAdvertisements Simplified] Error setting up query/listener:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load advertisements setup: ${message}`);
      setLoading(false);
    }
  // Dependencies reduced as we are not using userType or profileData directly in query/filter anymore
  }, [user?.uid]); 

  useEffect(() => {
    console.log('[useAdvertisements Simplified] useEffect triggered, calling fetchAds.');
    const unsubscribe = fetchAds();
    return () => {
      if (unsubscribe) {
        console.log('[useAdvertisements Simplified] useEffect cleanup running.');
        unsubscribe();
      }
    };
  // fetchAds dependency is correct here
  }, [fetchAds]); 

  return { ads, loading, error, refetch: fetchAds };
}