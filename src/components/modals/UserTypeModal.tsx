import React from 'react';
import { Users, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserTypeModal({ isOpen, onClose }: UserTypeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (type: 'influencer' | 'business') => {
    navigate(`/auth/${type}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Account Type</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSelect('influencer')}
            className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors flex items-center space-x-4"
          >
            <Users className="h-8 w-8 text-blue-500" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Local Influencer</div>
              <div className="text-sm text-gray-500">Connect with local businesses and grow your influence</div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('business')}
            className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors flex items-center space-x-4"
          >
            <Building2 className="h-8 w-8 text-blue-500" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Business Owner</div>
              <div className="text-sm text-gray-500">Find and collaborate with local influencers</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}