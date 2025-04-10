import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { BusinessOverview } from '../../components/dashboard/business/BusinessOverview';
import { InfluencerOverview } from '../../components/dashboard/influencer/InfluencerOverview';
import { seedMockCampaigns } from '../../lib/mockData';

export function Overview() {
  const userType = useAuthStore((state) => state.userType);
  
  return (
    <div>
      {/* The Development Tools section has been removed */}
      {userType === 'business' ? <BusinessOverview /> : <InfluencerOverview />}
    </div>
  );
}