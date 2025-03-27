import React from 'react';
import { Building2, Users, Globe, Target } from 'lucide-react';
import { Team } from '../components/about/Team';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      <div className="container mx-auto px-6 sm:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Connecting Local Businesses with Local Influencers
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            LocAD bridges the gap between local businesses and community influencers,
            fostering meaningful partnerships that drive sustainable local growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {[
            {
              icon: Building2,
              title: 'Local Business Growth',
              description: 'Empower local businesses to expand their customer base through strategic influencer collaborations.'
            },
            {
              icon: Users,
              title: 'Community Impact',
              description: 'Enable influencers to make a genuine impact within their communities, fostering local trust.'
            },
            {
              icon: Globe,
              title: 'Location-Based',
              description: 'Seamlessly connect businesses with influencers in their exact geographic area for maximum relevance.'
            },
            {
              icon: Target,
              title: 'Targeted Reach',
              description: 'Ensure the right audience is reached through authentic, hyper-local influencer marketing.'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-8 bg-white shadow-md rounded-xl hover:shadow-lg transition duration-300">
              <feature.icon className="w-14 h-14 text-blue-600 mx-auto mb-5" />
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-lg rounded-3xl p-10 md:p-16 mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
            We believe in the power of local communities. Our mission is to create a platform
            where local businesses can thrive through authentic partnerships with community
            influencers, fostering economic growth and strengthening local connections.
          </p>
        </div>

        <Team />
      </div>
    </div>
  );
}