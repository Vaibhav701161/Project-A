import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AUTH_ERRORS } from '../lib/errors';

export async function signUp(email, password, name, userType) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    
    const userDoc = {
      name,
      email,
      userType,
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);

    return { user, userType, error: null, message: 'Account successfully created!' };
  } catch (err) {
    const errorCode = err.code;
    return { user: null, userType: null, error: AUTH_ERRORS[errorCode] || AUTH_ERRORS.default };
  }
}

export async function signIn(email, password, attemptedUserType) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    if (!userData) {
      await signOut(auth);
      return { user: null, userType: null, error: 'User data not found. Please contact support.' };
    }

    if (userData.userType !== attemptedUserType) {
      await signOut(auth);
      return { 
        user: null, 
        userType: null, 
        error: `This account is registered as a ${userData.userType}. Please sign in accordingly.`
      };
    }

    return { 
      user, 
      userType: userData.userType, 
      hasCompletedOnboarding: userData.hasCompletedOnboarding,
      error: null,
      message: 'Login successful! Redirecting...'
    };
  } catch (err) {
    const errorCode = err.code;
    return { user: null, userType: null, error: AUTH_ERRORS[errorCode] || AUTH_ERRORS.default };
  }
}