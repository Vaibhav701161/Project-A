import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none p-4 rounded-lg hover:bg-gray-50">
              <span className="font-medium">{faq.question}</span>
              <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-2 px-4 text-gray-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}