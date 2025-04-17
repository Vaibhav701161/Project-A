import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Megaphone } from 'lucide-react';
import { useAdvertisements } from '../../hooks/useAdvertisements';
import { LoadingState } from '../../components/dashboard/LoadingState';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { useProfileData } from '../../hooks/useProfileData';
import { useAuthStore } from '../../store/authStore';

// Define your API base URL - IMPORTANT: Use environment variables in a real app!
// Example: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'; 
const API_BASE_URL = 'http://localhost:3001'; // Using a common default for now

export function Advertisements() {
  const { ads, loading, error } = useAdvertisements();
  const { profileData } = useProfileData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const userType = useAuthStore(state => state.userType);
  const user = useAuthStore(state => state.user); // Get user for userId
  const [appliedAdsSet, setAppliedAdsSet] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    // console.log('[useEffect] appliedAdsSet state updated/changed:', appliedAdsSet);
  }, [appliedAdsSet]);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(ads.map(ad => ad.category))];

  const handleApply = async (adId: string) => {
    console.log(`[handleApply] Clicked for adId: ${adId}`);
    const userId = user?.uid; // Get the current user's ID

    if (!userId) {
      console.error('[handleApply] User ID not found. Cannot apply.');
      alert('Error: Could not identify user. Please try logging in again.');
      return;
    }

    if (appliedAdsSet.has(adId)) {
      console.log(`[handleApply] Already applied to ${adId}. Aborting.`);
      return;
    }
    if (applyingId === adId) {
      console.log(`[handleApply] Already applying to ${adId}. Aborting.`);
      return;
    }

    console.log(`[handleApply] Setting applyingId to: ${adId}`);
    setApplyingId(adId);

    try {
      const applyUrl = `${API_BASE_URL}/api/apply`; // Construct full URL
      console.log(`[handleApply] Making actual API call to: ${applyUrl} for adId: ${adId}, userId: ${userId}`);
      
      const response = await fetch(applyUrl, { // Use the full URL
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Include Authorization header if your API requires it
          // 'Authorization': `Bearer ${your_auth_token}` 
        },
        body: JSON.stringify({ adId: adId, userId: userId }), // Send adId and userId
      });

      console.log(`[handleApply] API response status for ${adId}: ${response.status}`);
      if (!response.ok) {
        // Provide more context for 404
        if (response.status === 404) {
          throw new Error(`API call failed: Endpoint ${applyUrl} not found (404).`);
        } else {
          throw new Error(`API call failed with status: ${response.status}`);
        }
      }
      console.log(`[handleApply] API call successful for: ${adId}`);

      console.log(`[handleApply] Updating appliedAdsSet for: ${adId}`);
      setAppliedAdsSet(prevAppliedAdsSet => {
        const newSet = new Set(prevAppliedAdsSet);
        newSet.add(adId);
        console.log('[handleApply Functional Update] New appliedAdsSet:', newSet);
        return newSet;
      });
      console.log(`[handleApply] Showing success alert for: ${adId}`);
      alert('Applied successfully!');
      
    } catch (err) {
      // Log the full error object for more details
      console.error('[handleApply] Full Application error object:', err);
      
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
        // Specifically mention CORS if it looks like a network/fetch error without a specific status
        if (err.name === 'TypeError' && errorMessage.includes('Failed to fetch')) {
          errorMessage += ' (This might be a CORS issue or network problem. Check backend logs and CORS configuration.)';
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      alert(`Failed to apply: ${errorMessage}`); // Display the specific error
    } finally {
      console.log(`[handleApply] Resetting applyingId (was: ${applyingId})`);
      setApplyingId(null);
    }
  };

  if (loading) {
    return <LoadingState message="Loading advertisements..." />;
  }

  if (error) {
    // Display the error message from the hook
    return <div className="p-6 text-red-600 font-semibold">Error: {error}</div>;
  }

  if (userType === 'influencer' && !profileData?.city) {
    return (
      <EmptyState
        icon={MapPin}
        title="Location Required"
        description="Please set your location in your profile to find local advertising opportunities."
      />
    );
  }

  if (!ads.length) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No Campaigns Available"
        description={userType === 'influencer' 
          ? `There are currently no advertising campaigns in ${profileData?.city}. Check back soon for new opportunities!`
          : "There are currently no active campaigns. Check back soon for new opportunities!"}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Advertisements</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No campaigns match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAds.map((ad) => {
            const setHasId = appliedAdsSet.has(ad.id);
            const firstSetElement = [...appliedAdsSet][0];
            console.log(`[Render Ad ${ad.id}] Checking appliedAdsSet.has(${ad.id}). Set content:`, appliedAdsSet);
            console.log(`[Render Ad ${ad.id}] Type check: ad.id (${typeof ad.id}), first element in Set (${firstSetElement !== undefined ? typeof firstSetElement : 'Set is empty'})`);
            
            const isApplied = setHasId;
            const isApplying = applyingId === ad.id;

            console.log(`[Render Ad ${ad.id}] Calculated: isApplied=${isApplied}, isApplying=${isApplying}`);

            // Restore original render block
            return (
              <div key={ad.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{ad.title}</h3>
                        <p className="text-gray-600">{ad.businessName}</p>
                      </div>
                      {/* Apply Button Logic (using original classes) */}
                      {userType === 'influencer' && (
                        <button
                          onClick={() => handleApply(ad.id)}
                          disabled={isApplied || isApplying}
                          className={`px-6 py-2 rounded-md transition-colors text-white ${
                            isApplied
                              ? 'bg-gray-400 cursor-not-allowed'
                              : isApplying
                              ? 'bg-blue-400 cursor-wait'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isApplied ? 'Applied' : isApplying ? 'Applying...' : 'Apply'}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{ad.description}</p>
                    {/* Ad Details */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-semibold">{ad.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{ad.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold capitalize">{ad.category}</p>
                      </div>
                    </div>
                    {/* Requirements */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {ad.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
            // End original render block
          })}
        </div>
      )}
    </div>
  );
}