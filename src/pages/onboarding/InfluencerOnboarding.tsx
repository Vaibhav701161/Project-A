import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Instagram, Users, MapPin } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';

export function InfluencerOnboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    displayName: '',
    location: '',
    instagramHandle: '',
    followers: '',
    categories: [] as string[],
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, value]
        : prev.categories.filter(cat => cat !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'influencers', user.uid), {
        ...formData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: true
      });
      
      await setDoc(doc(db, 'users', user.uid), {
        hasCompletedOnboarding: true
      }, { merge: true });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving influencer profile:', error);
    }
  };

  const categories = [
    'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 
    'Fitness', 'Technology', 'Gaming', 'Art', 'Music'
  ];

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Influencer Profile</h1>
          <p className="mt-2 text-gray-500">Let’s get you set up on LocAD</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {[
              { label: 'Display Name', name: 'displayName', icon: <User />, type: 'text' },
              { label: 'Location', name: 'location', icon: <MapPin />, type: 'text' },
              { label: 'Instagram Handle', name: 'instagramHandle', icon: <Instagram />, type: 'text' },
              { label: 'Followers Count', name: 'followers', icon: <Users />, type: 'number' }
            ].map(({ label, name, icon, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="relative mt-1">
                  <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3"
                    required
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={category}
                      checked={formData.categories.includes(category)}
                      onChange={handleCategoryChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}
