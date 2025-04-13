import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, Globe } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';

export function BusinessOnboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    phone: '',
    website: '',
    category: '',
    description: ''
  });
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract city from address - assume it's after the last comma
      const addressParts = formData.address.split(',');
      const city = addressParts.length > 1 
        ? addressParts[addressParts.length - 2].trim() 
        : formData.address.trim();

      await setDoc(doc(db, 'businesses', user.uid), {
        ...formData,
        city, // Store the extracted city
        userId: user.uid,
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: true
      });

      await setDoc(doc(db, 'users', user.uid), {
        hasCompletedOnboarding: true
      }, { merge: true });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving business profile:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Business Profile</h1>
          <p className="mt-2 text-gray-600">Let's get your business set up on LocAD</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: 'businessName', label: 'Business Name', icon: Building2, type: 'text' },
            { name: 'address', label: 'Business Address', icon: MapPin, type: 'text' },
            { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
            { name: 'website', label: 'Website', icon: Globe, type: 'url' }
          ].map(({ name, label, icon: Icon, type }) => (
            <div key={name} className="relative">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="mt-1 relative">
                <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 py-2 px-3"
                  required
                />
              </div>
            </div>
          ))}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 py-2 px-3"
              required
            >
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 py-2 px-3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}
