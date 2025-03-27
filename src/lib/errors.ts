// Error messages for user-facing errors
export const AUTH_ERRORS = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'An account already exists with this email',
  'auth/weak-password': 'Password should be at least 6 characters',
  'default': 'An error occurred. Please try again.'
} as const;