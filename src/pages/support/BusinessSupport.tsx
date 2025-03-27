import React from 'react';
import { SupportHeader } from '../../components/support/SupportHeader';
import { FAQSection } from '../../components/support/FAQSection';
import { ContactSection } from '../../components/support/ContactSection';

const businessFAQs = [
  {
    question: "How do I create a new campaign?",
    answer: "To create a new campaign, go to your dashboard and click on the 'Create Campaign' button. Follow the step-by-step guide to set up your campaign details, budget, and requirements."
  },
  {
    question: "How do I find relevant influencers?",
    answer: "Use our influencer search feature with filters for location, niche, and follower count to find influencers that match your requirements. You can view their profiles and engagement rates before reaching out."
  },
  {
    question: "What are the payment terms?",
    answer: "Payments are processed securely through our platform. You'll only be charged once an influencer accepts your campaign and completes the agreed deliverables."
  }
];

export function BusinessSupport() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SupportHeader 
        title="Business Support Center"
        description="Find answers to common questions and get help with your business account"
      />
      
      <div className="grid gap-6 mt-6">
        <FAQSection faqs={businessFAQs} />
        <ContactSection userType="business" />
      </div>
    </div>
  );
}