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
  
  // Calculate actual earnings from completed campaigns
  const actualEarnings = ads
    .filter(ad => ad.status === 'completed' && ad.paymentStatus === 'paid') // Ensure it's completed AND paid
    .reduce((sum, ad) => {
      // Attempt to parse budget, default to 0 if invalid
      const budgetValue = parseFloat(ad.budget?.replace(/[^\d.-]/g, '')) || 0;
      return sum + budgetValue;
    }, 0);

  if (loading) {
    // Show placeholders while loading
    return <div className="grid md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      ))}
    </div>;
  }

  return (
    // Adjust grid columns based on whether earnings are shown
    <div className={`grid gap-6 ${actualEarnings > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {/* Conditionally render Total Earnings card */}
      {actualEarnings > 0 && (
        <StatCard
          title="Total Earnings"
          value={`$${actualEarnings.toFixed(2)}`} // Format to 2 decimal places
          icon={DollarSign}
          trend="Lifetime earned"
        />
      )}
      
      {/* Active Collaborations card */}
      <StatCard
        title="Active Collaborations"
        value={activeCollaborations.toString()}
        icon={TrendingUp}
        trend={`${appliedAds} pending applications`}
      />
      
      {/* Completed Projects card */}
      <StatCard
        title="Completed Projects"
        value={completedCollaborations.toString()}
        icon={Star}
        trend={`${completedCollaborations} total completed`}
      />
    </div>
  );
}