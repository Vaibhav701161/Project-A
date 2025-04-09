import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import Stripe from 'stripe';

admin.initializeApp();
const corsHandler = cors({ origin: true });

// Initialize Stripe with your secret key
// In production, use environment variables for sensitive keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

// Type definitions for our function data
interface PaymentIntentRequest {
  amount: number;
  campaignId: string;
  influencerId: string;
  metadata?: Record<string, any>;
}

interface PaymentMethodRequest {
  paymentMethodId: string;
}

interface ProcessPaymentRequest {
  paymentIntentId: string;
  paymentMethodId?: string;
}

// Create a payment intent
export const createPaymentIntent = functions.https.onCall<PaymentIntentRequest>({
  cors: true,
  region: 'us-central1',
  maxInstances: 10,
}, async (request) => {
  // Ensure user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Authentication required to create a payment intent'
    );
  }

  try {
    const { amount, campaignId, influencerId, metadata = {} } = request.data;

    // Validate input
    if (!amount || !campaignId || !influencerId) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'Missing required fields'
      );
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      metadata: {
        campaignId,
        businessId: request.auth.uid,
        influencerId,
        ...metadata,
      },
    });

    // Store record in Firestore
    await admin.firestore().collection('paymentIntents').doc(paymentIntent.id).set({
      stripePaymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      status: paymentIntent.status,
      campaignId,
      businessId: request.auth.uid,
      influencerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
});

// Create a payment method for a user
export const createPaymentMethod = functions.https.onCall<PaymentMethodRequest>({
  cors: true,
  region: 'us-central1',
  maxInstances: 10,
}, async (request) => {
  // Ensure user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Authentication required to create a payment method'
    );
  }

  try {
    const { paymentMethodId } = request.data;

    // Validate input
    if (!paymentMethodId) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'Missing payment method ID'
      );
    }

    // Retrieve the payment method from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Create a customer if one doesn't exist
    let customerId;
    const userSnapshot = await admin.firestore()
      .collection('users')
      .doc(request.auth.uid)
      .get();

    const userData = userSnapshot.data();
    
    if (userData && userData.stripeCustomerId) {
      customerId = userData.stripeCustomerId;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        metadata: {
          firebaseUid: request.auth.uid,
        },
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await admin.firestore()
        .collection('users')
        .doc(request.auth.uid)
        .update({
          stripeCustomerId: customerId,
        });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Store record in Firestore
    const paymentMethodRef = await admin.firestore().collection('paymentMethods').add({
      userId: request.auth.uid,
      stripePaymentMethodId: paymentMethod.id,
      stripeCustomerId: customerId,
      type: paymentMethod.type,
      last4: paymentMethod.card?.last4 || '',
      isDefault: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      methodId: paymentMethodRef.id,
    };
  } catch (error) {
    console.error('Error creating payment method:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
});

// Process payment (confirm payment intent)
export const processPayment = functions.https.onCall<ProcessPaymentRequest>({
  cors: true,
  region: 'us-central1',
  maxInstances: 10,
}, async (request) => {
  // Ensure user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Authentication required to process a payment'
    );
  }

  try {
    const { paymentIntentId, paymentMethodId } = request.data;

    // Validate input
    if (!paymentIntentId) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'Missing payment intent ID'
      );
    }

    // Get the payment intent from Firestore
    const paymentIntentDoc = await admin.firestore()
      .collection('paymentIntents')
      .doc(paymentIntentId)
      .get();

    if (!paymentIntentDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found', 
        'Payment intent not found'
      );
    }

    const paymentIntentData = paymentIntentDoc.data();

    // Ensure the authenticated user is the business owner
    if (paymentIntentData?.businessId !== request.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied', 
        'Unauthorized to process this payment'
      );
    }

    // Confirm the payment intent with Stripe
    const stripePaymentIntentId = paymentIntentData?.stripePaymentIntentId;
    if (!stripePaymentIntentId) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'Invalid payment intent'
      );
    }

    // If a payment method is provided, use it; otherwise use the default one
    const confirmOptions: Stripe.PaymentIntentConfirmParams = {};
    if (paymentMethodId) {
      confirmOptions.payment_method = paymentMethodId;
    }

    const paymentIntent = await stripe.paymentIntents.confirm(
      stripePaymentIntentId,
      confirmOptions
    );

    // Update the payment intent in Firestore
    await admin.firestore()
      .collection('paymentIntents')
      .doc(paymentIntentId)
      .update({
        status: paymentIntent.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return {
      success: true,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
});

// Webhook handler for Stripe events
export const stripeWebhook = functions.https.onRequest({
  cors: false,
  region: 'us-central1',
  maxInstances: 10,
}, async (request, response) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const sig = request.headers['stripe-signature'];

  if (!sig) {
    response.status(400).send('Missing stripe-signature header');
    return;
  }

  try {
    const event = stripe.webhooks.constructEvent(
      request.rawBody, 
      sig, 
      webhookSecret
    );

    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    response.status(200).send({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    response.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Helper functions for webhook handlers
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Find the payment intent in Firestore by Stripe ID
  const querySnapshot = await admin.firestore()
    .collection('paymentIntents')
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .get();

  if (querySnapshot.empty) {
    console.log(`No matching payment intent found for ID: ${paymentIntent.id}`);
    return;
  }

  const doc = querySnapshot.docs[0];
  
  // Update the payment intent status
  await doc.ref.update({
    status: 'succeeded',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update the campaign with payment status
  const data = doc.data();
  if (data.campaignId) {
    await admin.firestore()
      .collection('campaigns')
      .doc(data.campaignId)
      .update({
        paymentStatus: 'paid',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // You could also trigger notifications here
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Find the payment intent in Firestore by Stripe ID
  const querySnapshot = await admin.firestore()
    .collection('paymentIntents')
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .get();

  if (querySnapshot.empty) {
    console.log(`No matching payment intent found for ID: ${paymentIntent.id}`);
    return;
  }

  const doc = querySnapshot.docs[0];
  
  // Update the payment intent status
  await doc.ref.update({
    status: 'failed',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
  });

  // You could also trigger notifications here
} 