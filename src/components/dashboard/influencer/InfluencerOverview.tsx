import React from 'react';
import { DollarSign, Star, Bell, Briefcase } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { AvailableAds } from './AvailableAds';
import { useAdvertisements } from '../../../hooks/useAdvertisements';

export function InfluencerOverview() {
  const { ads, loading } = useAdvertisements();
  
  // Calculate statistics
  const availableAds = ads.filter(ad => ad.status === 'active').length;
  const appliedAds = ads.filter(ad => ad.status === 'pending').length;
  const activeCollaborations = ads.filter(ad => ad.status === 'in_progress').length;

  if (loading) {
    return <div className="p-6 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Influencer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Available Opportunities"
          value={availableAds.toString()}
          icon={Bell}
          trend={`${availableAds} new today`}
        />
        <StatCard
          title="Applied Campaigns"
          value={appliedAds.toString()}
          icon={Star}
          trend={`${appliedAds} pending`}
        />
        <StatCard
          title="Active Collaborations"
          value={activeCollaborations.toString()}
          icon={Briefcase}
          trend={`${activeCollaborations} in progress`}
        />
        <StatCard
          title="Estimated Earnings"
          value="$0"
          icon={DollarSign}
          trend="This month"
        />
      </div>

      <AvailableAds />
    </div>
  );
}