import React, { useState } from 'react';
import { User, Mail, MapPin, Instagram, Users, Tag, FileText, Save } from 'lucide-react';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileSection } from '../../components/profile/ProfileSection';
import { InfluencerStats } from '../../components/profile/InfluencerStats';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { useProfileData } from '../../hooks/useProfileData';

export function InfluencerProfile() {
  const { profileData, loading, error } = useProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData || {});
  const user = useAuthStore((state) => state.user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'influencers', user.uid);
      await updateDoc(docRef, formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return <div className="p-6 animate-pulse">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <ProfileHeader 
          title="Influencer Profile"
          description="Manage your profile information and settings"
        />
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          ) : (
            <span>Edit Profile</span>
          )}
        </button>
      </div>
      
      <div className="grid gap-6">
        <InfluencerStats />
        
        <ProfileSection title="Personal Information">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="displayName"
                  value={isEditing ? formData.displayName : profileData?.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={isEditing ? formData.email : profileData?.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={isEditing ? formData.location : profileData?.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Instagram Handle</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="instagramHandle"
                  value={isEditing ? formData.instagramHandle : profileData?.instagramHandle}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Followers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="followers"
                  value={isEditing ? formData.followers : profileData?.followers}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={isEditing ? formData.bio : profileData?.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}