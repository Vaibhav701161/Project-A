import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore(state => state.setUser);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  return { loading };
}