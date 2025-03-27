import React from 'react';
import { Search, Handshake, MessageCircle, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find Your Match',
    description: 'Businesses discover local influencers or influencers browse relevant campaigns in their area.'
  },
  {
    icon: MessageCircle,
    title: 'Connect & Discuss',
    description: 'Communicate directly to discuss campaign details, expectations, and deliverables.'
  },
  {
    icon: Handshake,
    title: 'Collaborate',
    description: 'Work together to create authentic content that resonates with the local community.'
  },
  {
    icon: DollarSign,
    title: 'Grow Together',
    description: 'Track performance, process payments, and build long-term partnerships.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple process to connect businesses with local influencers
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <step.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}