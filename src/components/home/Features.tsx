import React from 'react';
import { Target, Handshake, MapPin, TrendingUp, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Targeted Local Reach',
    description: 'Connect with influencers and businesses in your specific area for maximum impact'
  },
  {
    icon: Handshake,
    title: 'Authentic Partnerships',
    description: 'Build genuine relationships within your local community that drive real results'
  },
  {
    icon: MapPin,
    title: 'Location-Based Matching',
    description: 'Our smart algorithm finds the perfect partners in your local market'
  },
  {
    icon: TrendingUp,
    title: 'Growth Analytics',
    description: 'Track your campaign performance with detailed analytics and insights'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data and transactions are protected with enterprise-grade security'
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Get started in minutes with our streamlined onboarding process'
  }
];

export function Features() {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              LocAD
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make it easy to create meaningful connections in your local community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}