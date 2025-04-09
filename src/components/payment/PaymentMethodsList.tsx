import React, { useEffect, useState } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { getPaymentMethods, PaymentMethod } from '../../services/payment';

interface PaymentMethodsListProps {
  onSelectMethod?: (methodId: string) => void;
  selectedMethodId?: string;
}

export function PaymentMethodsList({ 
  onSelectMethod, 
  selectedMethodId 
}: PaymentMethodsListProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPaymentMethods();
      
      if (result.success && result.methods) {
        setMethods(result.methods);
      } else {
        throw new Error(result.error || 'Failed to load payment methods');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading payment methods...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error: {error}
        <button 
          onClick={loadPaymentMethods}
          className="block mx-auto mt-2 text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No payment methods found. Add a payment method to continue.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Your Payment Methods</h3>
      <div className="grid gap-3">
        {methods.map(method => (
          <div 
            key={method.id} 
            className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
              selectedMethodId === method.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectMethod?.(method.id)}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="text-gray-400" />
              <div>
                <div className="font-medium">
                  {method.type === 'card' ? 'Credit Card' : 'Bank Account'}
                </div>
                <div className="text-sm text-gray-500">
                  {method.type === 'card' ? '•••• ' : ''}{method.last4}
                  {method.isDefault && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              className="text-gray-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                // In a real implementation, you would call an API to delete the payment method
                // For now, we'll just remove it from the local state
                setMethods(methods.filter(m => m.id !== method.id));
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 