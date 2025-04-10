import React, { useState } from 'react';
import { Checkout } from '../components/payment/Checkout';
import { useNavigate } from 'react-router-dom';

export function PaymentTest() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(100);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Test data
  const testCampaignId = 'test-campaign-123';
  const testInfluencerId = 'test-influencer-456';
  
  const handlePaymentSuccess = () => {
    alert('Payment successful!');
    navigate('/payment-history');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Gateway Test</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Configure Test Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
                  Payment Amount (USD)
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">$</span>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    max="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Payment Gateway Test Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>This page demonstrates the Stripe payment integration</li>
                  <li>Use test card number: <span className="font-mono">4242 4242 4242 4242</span></li>
                  <li>Any future date for expiration</li>
                  <li>Any 3-digit CVC</li>
                  <li>Any 5-digit ZIP code</li>
                </ul>
              </div>
              
              <button
                onClick={() => setShowCheckout(!showCheckout)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showCheckout ? 'Hide Payment Form' : 'Show Payment Form'}
              </button>
            </div>
          </div>
          
          {showCheckout && (
            <div className="border-t pt-6">
              <Checkout
                campaignId={testCampaignId}
                influencerId={testInfluencerId}
                amount={amount * 100} // Convert to cents for Stripe
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowCheckout(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 