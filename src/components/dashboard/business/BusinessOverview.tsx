import React, { useState } from 'react';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { RecentCampaigns } from './RecentCampaigns';
import { CreateAdButton } from './CreateAdButton';
import { AdForm, AdFormData } from './AdForm';
import { createAdvertisement } from '../../../services/advertisements';
import { useAuthStore } from '../../../store/authStore';
import { useProfileData } from '../../../hooks/useProfileData';
import { useAdvertisements } from '../../../hooks/useAdvertisements';

export function BusinessOverview() {
  const [showAdForm, setShowAdForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const { profileData } = useProfileData();
  const { ads, loading, refetch } = useAdvertisements();

  // Calculate statistics
  const activeAds = ads.filter(ad => ad.status === 'active').length;
  const pendingRequests = ads.filter(ad => ad.status === 'pending').length;
  const completedAds = ads.filter(ad => ad.status === 'completed').length;
  const totalInfluencers = ads.reduce((sum, ad) => sum + (ad.applications || 0), 0);

  const handleCreateAd = async (data: AdFormData) => {
    if (!user?.uid || !profileData?.address) {
      setError('Please complete your business profile first');
      return;
    }

    const result = await createAdvertisement(user.uid, {
      ...data,
      businessName: profileData.businessName
    });

    if (result.error) {
      setError(result.error);
    } else {
      setShowAdForm(false);
      // Refetch advertisements to update the list
      refetch();
    }
  };

  if (loading) {
    return <div className="p-6 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Dashboard</h1>
        <CreateAdButton onClick={() => setShowAdForm(true)} />
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Campaigns"
          value={activeAds.toString()}
          icon={TrendingUp}
          trend={`${activeAds} active`}
        />
        <StatCard
          title="Reached Influencers"
          value={totalInfluencers.toString()}
          icon={Users}
          trend={`${totalInfluencers} total applications`}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={Clock}
          trend={`${pendingRequests} to review`}
        />
        <StatCard
          title="Completed Campaigns"
          value={completedAds.toString()}
          icon={CheckCircle}
          trend={`${completedAds} finished`}
        />
      </div>

      <RecentCampaigns onCreateAd={() => setShowAdForm(true)} />

      {showAdForm && (
        <AdForm 
          onSubmit={handleCreateAd}
          onClose={() => setShowAdForm(false)}
        />
      )}
    </div>
  );
}