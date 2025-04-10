import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
// In a production app, this should be environment-specific
export const publishableKey = 'pk_test_51HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx';

export const stripePromise = loadStripe(publishableKey);

// For security, we should not include secret keys in client-side code
// Server operations should be handled by Firebase Functions or a backend service 