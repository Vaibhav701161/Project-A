import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../services/payment';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

export function PaymentHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPaymentHistory();
      
      if (result.success && result.history) {
        setHistory(result.history);
      } else {
        setError(result.error || 'Failed to load payment history. Please try again.');
      }
    } catch (err) {
      console.error('Client-side error loading payment history:', err);
      setError('An unexpected client error occurred. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>
        <div className="text-center py-8">Loading payment history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>
        <div className="flex items-center p-4 bg-red-100 text-red-700 rounded-lg">
          <AlertTriangle className="h-5 w-5 mr-3" />
          <div>
            <p className="font-semibold">Access Denied or Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={loadPaymentHistory}
            className="ml-auto text-sm text-blue-600 hover:underline focus:outline-none"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payment history found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Campaign</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {transaction.createdAt instanceof Date
                      ? format(transaction.createdAt, 'MMM d, yyyy')
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {transaction.campaignId}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {typeof transaction.amount === 'number'
                      ? `$${(transaction.amount / 100).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 