import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { Testimonials } from '../components/home/Testimonials';
import { Stats } from '../components/home/Stats';
import { CTASection } from '../components/home/CTASection';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTASection />
    </div>
  );
}