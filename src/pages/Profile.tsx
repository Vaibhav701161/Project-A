import React from 'react';
import { useAuthStore } from '../store/authStore';
import { BusinessProfile } from './profile/BusinessProfile';
import { InfluencerProfile } from './profile/InfluencerProfile';

export function Profile() {
  const userType = useAuthStore((state) => state.userType);
  
  return userType === 'business' ? <BusinessProfile /> : <InfluencerProfile />;
}