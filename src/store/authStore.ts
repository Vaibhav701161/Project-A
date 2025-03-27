import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase';

interface AuthState {
  user: any | null;
  userType: 'influencer' | 'business' | null;
  setUser: (user: any) => void;
  setUserType: (type: 'influencer' | 'business' | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userType: null,
      setUser: (user) => set({ user }),
      setUserType: (type) => set({ userType: type }),
    }),
    {
      name: 'auth-storage',
    }
  )
);