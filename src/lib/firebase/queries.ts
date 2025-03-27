import { collection, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

// Simple query for business ads - only needs single field index
export const getBusinessAdsQuery = (userId: string) => {
  return query(
    collection(db, COLLECTIONS.ADVERTISEMENTS),
    where('businessId', '==', userId),
    orderBy('createdAt', 'desc')
  );
};

// Location-based query for active ads
export const getLocationBasedAdsQuery = (location: string) => {
  // Don't query if location is empty
  if (!location) {
    return query(collection(db, COLLECTIONS.ADVERTISEMENTS));
  }

  return query(
    collection(db, COLLECTIONS.ADVERTISEMENTS),
    where('location', '==', location),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
};