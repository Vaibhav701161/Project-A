import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const createPaymentIntentFn = httpsCallable(functions, 'createPaymentIntent');
const createPaymentMethodFn = httpsCallable(functions, 'createPaymentMethod');
const processPaymentFn = httpsCallable(functions, 'processPayment');
const getPaymentHistoryFn = httpsCallable(functions, 'getPaymentHistory');

// Types for payment operations
export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  campaignId: string;
  businessId: string;
  influencerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  isDefault: boolean;
}

// Create a payment intent for a campaign
export const createPaymentIntent = async (
  campaignId: string,
  influencerId: string,
  amount: number
): Promise<{ success: boolean; paymentIntentId?: string; clientSecret?: string; error?: string }> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const result = await createPaymentIntentFn({
      amount,
      campaignId,
      influencerId
    });
    
    const data = result.data as any;
    
    if (data.success) {
      return {
        success: true,
        paymentIntentId: data.paymentIntentId,
        clientSecret: data.clientSecret
      };
    } else {
      return { success: false, error: data.error || 'Failed to create payment intent' };
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Confirm a payment intent (process payment)
export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethodId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await processPaymentFn({
      paymentIntentId,
      paymentMethodId
    });
    
    const data = result.data as any;
    
    if (data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Failed to confirm payment' };
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Get payment methods for current user
export const getPaymentMethods = async (): Promise<{ 
  success: boolean; 
  methods?: PaymentMethod[]; 
  error?: string 
}> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const methodsQuery = query(
      collection(db, 'paymentMethods'), 
      where('userId', '==', currentUser.uid)
    );
    
    const methodsSnapshot = await getDocs(methodsQuery);
    const methods: PaymentMethod[] = [];
    
    methodsSnapshot.forEach(doc => {
      const data = doc.data() as Omit<PaymentMethod, 'id'>;
      methods.push({ id: doc.id, ...data });
    });
    
    return { success: true, methods };
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Add a payment method for current user
export const addPaymentMethod = async (
  type: 'card' | 'bank_account',
  paymentMethodId: string
): Promise<{ success: boolean; methodId?: string; error?: string }> => {
  try {    
    const result = await createPaymentMethodFn({
      paymentMethodId
    });
    
    const data = result.data as any;
    
    if (data.success) {
      return { success: true, methodId: data.methodId };
    } else {
      return { success: false, error: data.error || 'Failed to add payment method' };
    }
  } catch (error) {
    console.error('Error adding payment method:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Get payment history for current user using Cloud Function
export const getPaymentHistory = async (): Promise<{
  success: boolean;
  history?: any[];
  error?: string;
}> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      // This check is still good practice client-side
      return { success: false, error: 'User not authenticated' };
    }

    // Call the Cloud Function
    const result = await getPaymentHistoryFn();
    const data = result.data as any;

    if (data.success) {
      // Process dates if needed (Cloud Function already converts to ISO string)
      const historyWithDates = data.history.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : null,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
      }));
      return { success: true, history: historyWithDates };
    } else {
      // Provide a more specific error based on the code from the function
      let errorMessage = data.error || 'Failed to load payment history.';
      if (data.code === 'unauthenticated') {
        errorMessage = 'You must be logged in to view payment history.';
      } else if (data.code === 'not-found') {
        errorMessage = 'User profile not found. Cannot fetch history.';
      }
      return { success: false, error: errorMessage };
    }
  } catch (error: any) {
    console.error('Error calling getPaymentHistory function:', error);
    let errorMessage = 'An unexpected error occurred while fetching payment history.';
    // Check for Firebase Functions specific errors
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      errorMessage = 'You do not have permission to access this resource.';
    }
    return { 
      success: false, 
      error: errorMessage
    };
  }
}; 