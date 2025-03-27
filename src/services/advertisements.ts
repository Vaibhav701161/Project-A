import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdFormData } from '../components/dashboard/business/AdForm';

export async function createAdvertisement(userId: string, data: AdFormData & { businessName?: string }) {
  try {
    // Get business data first
    const businessDocRef = doc(db, 'businesses', userId);
    const businessDocSnap = await getDoc(businessDocRef);
    const businessData = businessDocSnap.data();

    if (!businessData) {
      throw new Error('Business data not found');
    }

    const adData = {
      ...data,
      businessId: userId,
      businessName: businessData.businessName,
      location: businessData.address, // Use business address as location
      status: 'active',
      createdAt: serverTimestamp(),
      applications: 0
    };

    const docRef = await addDoc(collection(db, 'advertisements'), adData);
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return { id: null, error: error instanceof Error ? error.message : 'Failed to create advertisement' };
  }
}