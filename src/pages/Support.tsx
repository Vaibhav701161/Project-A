import React from 'react';
import { useAuthStore } from '../store/authStore';
import { BusinessSupport } from './support/BusinessSupport';
import { InfluencerSupport } from './support/InfluencerSupport';

export function Support() {
  const userType = useAuthStore((state) => state.userType);
  
  return userType === 'business' ? <BusinessSupport /> : <InfluencerSupport />;
}