import React from 'react';
import { Megaphone } from 'lucide-react';
import { useAdvertisements } from '../../../hooks/useAdvertisements';
import { EmptyState } from '../EmptyState';

export function AvailableAds() {
  const { ads, loading, error } = useAdvertisements();

  if (loading) {
    return <div className="animate-pulse">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!ads.length) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No opportunities available"
        description="There are currently no advertising campaigns in your area. Check back soon for new opportunities!"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Available Opportunities</h2>
        <div className="grid gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                {ad.businessLogo && (
                  <img
                    src={ad.businessLogo}
                    alt={ad.businessName}
                    className="w-16 h-16 rounded-lg object-cover mr-6"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{ad.title}</h3>
                      <p className="text-gray-600">{ad.businessName}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4">{ad.description}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}