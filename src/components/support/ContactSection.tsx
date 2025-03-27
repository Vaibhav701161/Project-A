import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  userType: 'influencer' | 'business';
}

export function ContactSection({ userType }: ContactSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Email Support</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get help via email. We typically respond within 24 hours.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Send Email
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Live Chat</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Chat with our {userType} support team in real-time.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}