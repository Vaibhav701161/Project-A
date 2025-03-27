import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Local Impact?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses and influencers creating authentic local partnerships
          </p>
          <button
            onClick={() => navigate('/auth/business')}
            className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}