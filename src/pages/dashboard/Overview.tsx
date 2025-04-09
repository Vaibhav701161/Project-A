import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { BusinessOverview } from '../../components/dashboard/business/BusinessOverview';
import { InfluencerOverview } from '../../components/dashboard/influencer/InfluencerOverview';
import { seedMockCampaigns } from '../../lib/mockData';

export function Overview() {
  const userType = useAuthStore((state) => state.userType);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const handleSeedData = async () => {
    try {
      setSeeding(true);
      setSeedResult(null);
      await seedMockCampaigns();
      setSeedResult({ success: true, message: 'Test campaigns created successfully! Check the Campaigns section.' });
    } catch (error) {
      setSeedResult({ success: false, message: 'Failed to create test campaigns.' });
      console.error(error);
    } finally {
      setSeeding(false);
    }
  };
  
  return (
    <div>
      {/* Development tools row */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Development Tools</h3>
            <p className="text-xs text-gray-500">These options are available for testing purposes only.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-purple-300 flex items-center gap-1.5"
            >
              {seeding ? 'Creating...' : 'Seed Test Campaigns'}
            </button>
            
            <a 
              href="/payment-test" 
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1.5"
            >
              Test Payment Gateway
            </a>
          </div>
        </div>
        
        {seedResult && (
          <div className={`mt-3 p-2 text-sm rounded ${seedResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {seedResult.message}
          </div>
        )}
      </div>
      
      {userType === 'business' ? <BusinessOverview /> : <InfluencerOverview />}
    </div>
  );
}