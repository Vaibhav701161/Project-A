import React from 'react';
import { Users, Building2, MapPin, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Influencers',
    trend: '+25% this month'
  },
  {
    icon: Building2,
    value: '5K+',
    label: 'Local Businesses',
    trend: '+40% this month'
  },
  {
    icon: MapPin,
    value: '100+',
    label: 'Cities Covered',
    trend: 'Growing daily'
  },
  {
    icon: TrendingUp,
    value: '50K+',
    label: 'Successful Campaigns',
    trend: '+30% this quarter'
  }
];

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-gray-900">{stat.value}</h4>
                  <p className="text-gray-600">{stat.label}</p>
                  <p className="text-sm text-blue-600 mt-1">{stat.trend}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}