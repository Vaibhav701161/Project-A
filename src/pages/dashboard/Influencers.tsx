import React, { useState, useEffect } from 'react';
import { Search, MapPin, Instagram, Users } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useProfileData } from '../../hooks/useProfileData';
import { EmptyState } from '../../components/dashboard/EmptyState';

interface Influencer {
  id: string;
  displayName: string;
  location: string;
  followers: string;
  instagramHandle: string;
  categories: string[];
  bio: string;
  image?: string;
}

export function Influencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { profileData } = useProfileData();

  useEffect(() => {
    async function fetchInfluencers() {
      try {
        if (!profileData?.address) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'influencers'),
          where('location', '==', profileData.address)
        );
        const querySnapshot = await getDocs(q);
        const influencerData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Influencer[];
        setInfluencers(influencerData);
      } catch (error) {
        console.error('Error fetching influencers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInfluencers();
  }, [profileData?.address]);

  const filteredInfluencers = influencers.filter(influencer =>
    influencer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!profileData?.address) {
    return (
      <EmptyState
        icon={MapPin}
        title="Location Required"
        description="Please set your business address in your profile to find local influencers."
      />
    );
  }

  if (influencers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Influencers Found"
        description={`There are currently no influencers in ${profileData.address}. Check back later as our community grows!`}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Find Local Influencers</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search influencers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {filteredInfluencers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No influencers match your search criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <div key={influencer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{influencer.displayName}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{influencer.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Instagram className="w-4 h-4 mr-1" />
                  <span className="text-sm">{influencer.instagramHandle}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="font-semibold">{influencer.followers}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {influencer.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{influencer.bio}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}