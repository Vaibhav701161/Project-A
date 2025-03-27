import React, { useState } from 'react';
import { Search, Filter, MapPin, Megaphone } from 'lucide-react';
import { useAdvertisements } from '../../hooks/useAdvertisements';
import { LoadingState } from '../../components/dashboard/LoadingState';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { useProfileData } from '../../hooks/useProfileData';

export function Advertisements() {
  const { ads, loading, error } = useAdvertisements();
  const { profileData } = useProfileData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(ads.map(ad => ad.category))];

  if (loading) {
    return <LoadingState message="Loading advertisements..." />;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!profileData?.location) {
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
        description="There are currently no advertising campaigns in your area. Check back soon for new opportunities!"
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
          {filteredAds.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
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
      )}
    </div>
  );
}