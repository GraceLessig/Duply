import { FirebaseError } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { firebaseAuth, isFirebaseConfigured } from '../services/firebaseClient';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
  error: null,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  clearAuthError: () => {},
});

function authErrorMessage(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : '';

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'That email or password is not right.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'That email already has an account. Try signing in instead.';
  }
  if (code === 'auth/weak-password') {
    return 'Use a password with at least 6 characters.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in was closed before it finished.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase Authentication settings.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'This sign-in method is not enabled in Firebase Authentication yet.';
  }
  if (error instanceof Error && error.message === 'google-native-unavailable') {
    return 'Google sign-in is currently available on the web build. Use email sign-in here.';
  }

  return 'Something went wrong while signing in. Please try again.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(firebaseAuth, nextUser => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const runAuthAction = useCallback(async (action: () => Promise<void>) => {
    if (!firebaseAuth) {
      setError('Firebase Auth is not configured yet.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback((email: string, password: string) => runAuthAction(async () => {
    if (!firebaseAuth) return;
    await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  }), [runAuthAction]);

  const signUpWithEmail = useCallback((email: string, password: string, displayName?: string) => runAuthAction(async () => {
    if (!firebaseAuth) return;
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
    if (displayName?.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }
  }), [runAuthAction]);

  const signInWithGoogle = useCallback(() => runAuthAction(async () => {
    if (!firebaseAuth) return;
    if (Platform.OS !== 'web') {
      throw new Error('google-native-unavailable');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(firebaseAuth, provider);
  }), [runAuthAction]);

  const signOut = useCallback(() => runAuthAction(async () => {
    if (!firebaseAuth) return;
    await firebaseSignOut(firebaseAuth);
  }), [runAuthAction]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: isFirebaseConfigured,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        clearAuthError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
