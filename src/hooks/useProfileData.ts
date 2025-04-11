import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export interface ProfileData {
  // Common fields
  name: string;
  email: string;
  location: string;
  city?: string;
  createdAt: string;
  
  // Business specific fields
  businessName?: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  description?: string;

  // Influencer specific fields
  displayName?: string;
  instagramHandle?: string;
  followers?: string;
  categories?: string[];
  bio?: string;
}

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const userType = useAuthStore(state => state.userType);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user?.uid || !userType) return;

      try {
        const collection = userType === 'business' ? 'businesses' : 'influencers';
        const docRef = doc(db, collection, user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Merge Firestore data with auth email
          setProfileData({
            ...docSnap.data() as ProfileData,
            email: user.email || '' // Use email from Firebase Auth
          });
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        setError('Error fetching profile data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user?.uid, user?.email, userType]);

  return { profileData, loading, error };
}