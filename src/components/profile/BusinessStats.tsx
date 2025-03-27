import React from 'react';
import { TrendingUp, Users, CheckCircle } from 'lucide-react';
import { StatCard } from '../dashboard/common/StatCard';
import { useAdvertisements } from '../../hooks/useAdvertisements';

export function BusinessStats() {
  const { ads, loading } = useAdvertisements();
  
  // Calculate statistics from real data
  const activeAds = ads.filter(ad => ad.status === 'active').length;
  const totalInfluencers = ads.reduce((sum, ad) => sum + (ad.applications || 0), 0);
  const completedAds = ads.filter(ad => ad.status === 'completed').length;

  if (loading) {
    return <div className="grid md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      ))}
    </div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <StatCard
        title="Active Campaigns"
        value={activeAds.toString()}
        icon={TrendingUp}
        trend={`${activeAds} running`}
      />
      <StatCard
        title="Influencer Partnerships"
        value={totalInfluencers.toString()}
        icon={Users}
        trend={`${totalInfluencers} applications`}
      />
      <StatCard
        title="Completed Campaigns"
        value={completedAds.toString()}
        icon={CheckCircle}
        trend={`${completedAds} finished`}
      />
    </div>
  );
}