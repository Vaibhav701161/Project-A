import React, { useState } from 'react';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../lib/stripe';
import { PaymentForm } from './PaymentForm';
import { PaymentMethodsList } from './PaymentMethodsList';
import { createPaymentIntent, confirmPayment } from '../../services/payment';

interface CheckoutProps {
  campaignId: string;
  influencerId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function Checkout({ 
  campaignId, 
  influencerId, 
  amount, 
  onSuccess, 
  onCancel 
}: CheckoutProps) {
  const [step, setStep] = useState<'select-method' | 'add-method' | 'confirm'>('select-method');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [paymentIntentData, setPaymentIntentData] = useState<{
    id: string;
    clientSecret: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleAddPaymentMethod = (methodId: string) => {
    setSelectedMethodId(methodId);
    setStep('confirm');
  };

  const handlePreparePayment = async () => {
    if (!selectedMethodId) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create a payment intent
      const intentResult = await createPaymentIntent(
        campaignId,
        influencerId,
        amount
      );

      if (!intentResult.success || !intentResult.paymentIntentId || !intentResult.clientSecret) {
        throw new Error(intentResult.error || 'Failed to create payment intent');
      }

      setPaymentIntentData({
        id: intentResult.paymentIntentId,
        clientSecret: intentResult.clientSecret
      });
      
      setStep('confirm');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!stripe || !elements || !paymentIntentData || !selectedMethodId) {
      setError('Payment cannot be processed. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm the payment with Stripe.js
      const { error: stripeError } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret, 
        {
          payment_method: selectedMethodId
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Payment successful
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Payment amount</div>
        <div className="text-xl font-semibold">${(amount / 100).toFixed(2)}</div>
      </div>

      {step === 'select-method' && (
        <div className="space-y-6">
          <PaymentMethodsList
            onSelectMethod={(methodId) => setSelectedMethodId(methodId)}
            selectedMethodId={selectedMethodId || undefined}
          />
          
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={() => setStep('add-method')}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add new payment method
            </button>
            
            <div className="space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePreparePayment}
                disabled={!selectedMethodId || isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'add-method' && (
        <div className="space-y-6">
          <Elements stripe={stripePromise}>
            <PaymentForm
              onSuccess={handleAddPaymentMethod}
              onError={setError}
            />
          </Elements>
          
          <button
            onClick={() => setStep('select-method')}
            className="w-full text-center text-blue-600 hover:text-blue-800"
          >
            Back to saved methods
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">Payment Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Campaign payment</span>
              <span>${(amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>${(amount / 100).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep('select-method')}
              className="text-blue-600 hover:text-blue-800"
            >
              Change payment method
            </button>
            
            <div className="space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing || !paymentIntentData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 