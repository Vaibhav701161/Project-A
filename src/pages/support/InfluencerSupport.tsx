import React from 'react';
import { SupportHeader } from '../../components/support/SupportHeader';
import { FAQSection } from '../../components/support/FAQSection';
import { ContactSection } from '../../components/support/ContactSection';

const influencerFAQs = [
  {
    question: "How do I apply for campaigns?",
    answer: "Browse available campaigns in your dashboard and click 'Apply' on the ones that interest you. Make sure to read the requirements carefully before applying."
  },
  {
    question: "When and how do I get paid?",
    answer: "Payments are processed within 7 days of completing campaign deliverables. You'll receive payment through your connected payment method."
  },
  {
    question: "How can I improve my profile visibility?",
    answer: "Keep your profile updated with recent metrics, maintain a high response rate, and complete campaigns successfully to improve your visibility to businesses."
  }
];

export function InfluencerSupport() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SupportHeader 
        title="Influencer Support Center"
        description="Find answers to common questions and get help with your influencer account"
      />
      
      <div className="grid gap-6 mt-6">
        <FAQSection faqs={influencerFAQs} />
        <ContactSection userType="influencer" />
      </div>
    </div>
  );
}