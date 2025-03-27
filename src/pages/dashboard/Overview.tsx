import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { BusinessOverview } from '../../components/dashboard/business/BusinessOverview';
import { InfluencerOverview } from '../../components/dashboard/influencer/InfluencerOverview';

export function Overview() {
  const userType = useAuthStore((state) => state.userType);
  
  return userType === 'business' ? <BusinessOverview /> : <InfluencerOverview />;
}