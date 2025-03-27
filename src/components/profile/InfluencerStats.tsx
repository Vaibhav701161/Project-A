import React from 'react';
import { TrendingUp, DollarSign, Star } from 'lucide-react';
import { StatCard } from '../dashboard/common/StatCard';
import { useAdvertisements } from '../../hooks/useAdvertisements';

export function InfluencerStats() {
  const { ads, loading } = useAdvertisements();
  
  // Calculate statistics from real data
  const appliedAds = ads.filter(ad => ad.status === 'pending').length;
  const activeCollaborations = ads.filter(ad => ad.status === 'in_progress').length;
  const completedCollaborations = ads.filter(ad => ad.status === 'completed').length;
  
  // Calculate estimated earnings (example calculation)
  const estimatedEarnings = ads
    .filter(ad => ad.status === 'completed')
    .reduce((sum, ad) => {
      const budget = parseInt(ad.budget.replace(/[^0-9]/g, '')) || 0;
      return sum + budget;
    }, 0);

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
        title="Total Earnings"
        value={`$${estimatedEarnings}`}
        icon={DollarSign}
        trend="This month"
      />
      <StatCard
        title="Active Collaborations"
        value={activeCollaborations.toString()}
        icon={TrendingUp}
        trend={`${appliedAds} pending`}
      />
      <StatCard
        title="Completed Projects"
        value={completedCollaborations.toString()}
        icon={Star}
        trend={`${completedCollaborations} total`}
      />
    </div>
  );
}