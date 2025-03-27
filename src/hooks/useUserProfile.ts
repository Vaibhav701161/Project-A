import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export function useUserProfile() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user?.uid) {
        setHasCompletedOnboarding(false);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setHasCompletedOnboarding(userDoc.data()?.hasCompletedOnboarding ?? false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      } finally {
        setLoading(false);
      }
    }

    checkOnboardingStatus();
  }, [user?.uid]);

  return { hasCompletedOnboarding, loading };
}