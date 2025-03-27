import React from 'react';
import { FileText } from 'lucide-react';
import { useAdvertisements } from '../../../hooks/useAdvertisements';
import { EmptyState } from '../EmptyState';
import { LoadingState } from '../LoadingState';

interface RecentCampaignsProps {
  onCreateAd: () => void;
}

export function RecentCampaigns({ onCreateAd }: RecentCampaignsProps) {
  const { ads, loading, error } = useAdvertisements();

  if (loading) {
    return <LoadingState message="Loading campaigns..." />;
  }

  if (error) {
    return <div className="text-red-600 p-4 text-center">{error}</div>;
  }

  if (!ads.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No campaigns yet"
        description="Create your first advertising campaign to start connecting with local influencers."
        actionLabel="Create Campaign"
        onAction={onCreateAd}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Campaign</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Applications</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b">
                  <td className="py-3">{ad.title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      ad.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="py-3">{ad.applications || 0} applications</td>
                  <td className="py-3">{new Date(ad.createdAt?.toDate()).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}