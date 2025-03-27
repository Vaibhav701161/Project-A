import React from 'react';
import { Users, Building2 } from 'lucide-react';

interface UserTypeSelectorProps {
  onSelect: (type: 'influencer' | 'business') => void;
}

export function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Account Type</h2>
      
      <button
        onClick={() => onSelect('influencer')}
        className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors flex items-center space-x-4"
      >
        <Users className="h-8 w-8 text-blue-500" />
        <div className="text-left">
          <div className="font-semibold text-gray-900">Local Influencer</div>
          <div className="text-sm text-gray-500">Connect with local businesses and grow your influence</div>
        </div>
      </button>

      <button
        onClick={() => onSelect('business')}
        className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors flex items-center space-x-4"
      >
        <Building2 className="h-8 w-8 text-blue-500" />
        <div className="text-left">
          <div className="font-semibold text-gray-900">Business Owner</div>
          <div className="text-sm text-gray-500">Find and collaborate with local influencers</div>
        </div>
      </button>
    </div>
  );
}