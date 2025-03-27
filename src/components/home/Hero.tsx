import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ArrowRight } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="container mx-auto px-4 py-20 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Connect with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Local Influencers
            </span>{' '}
            and Grow Your Business
          </h1>
          <p className="text-xl text-gray-600 mb-12 animate-slide-up-delay leading-relaxed">
            Join the platform that brings together local businesses and community influencers
            to create authentic partnerships and drive meaningful growth.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/auth/business')}
              className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Building2 className="w-5 h-5" />
              <span>I'm a Business</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/auth/influencer')}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-100"
            >
              <Users className="w-5 h-5" />
              <span>I'm an Influencer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}