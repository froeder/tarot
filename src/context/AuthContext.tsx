import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseInitialized } from '../services/firebase';
import { UserProfile } from '../types/tarot';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, zodiacSign: string) => Promise<void>;
  signInAsGuest: (name?: string, zodiacSign?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const LOCAL_USER_KEY = '@meutarot_active_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session on mount
  useEffect(() => {
    let unsubscribe = () => {};

    const initAuth = async () => {
      try {
        // Check local saved user profile first
        const savedUserStr = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
        }

        // If firebase auth is working, listen to auth state changes
        if (isFirebaseInitialized && auth) {
          unsubscribe = onAuthStateChanged(auth, async (fbUser: User | null) => {
            if (fbUser) {
              let profile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName || 'Consulente Astral',
                isAnonymous: fbUser.isAnonymous,
              };

              // Fetch additional profile data from Firestore if available
              if (db) {
                try {
                  const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
                  if (docSnap.exists()) {
                    profile = { ...profile, ...docSnap.data() };
                  }
                } catch {
                  // Ignore firestore fetch error, use basic profile
                }
              }

              setUser(profile);
              await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
            }
          });
        }
      } catch (err) {
        console.warn('Error during auth initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isFirebaseInitialized && auth) {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = userCred.user;
        let profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || email,
          displayName: fbUser.displayName || email.split('@')[0],
        };

        if (db) {
          try {
            const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
            if (docSnap.exists()) {
              profile = { ...profile, ...docSnap.data() };
            }
          } catch (e) {
            console.warn('Error loading user doc from Firestore:', e);
          }
        }

        setUser(profile);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      } else {
        // Demo/offline mode simulation
        const profile: UserProfile = {
          uid: `user_${Date.now()}`,
          email,
          displayName: email.split('@')[0],
          zodiacSign: 'Áries',
        };
        setUser(profile);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, name: string, zodiacSign: string) => {
    setIsLoading(true);
    try {
      if (isFirebaseInitialized && auth) {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        const fbUser = userCred.user;
        const profile: UserProfile = {
          uid: fbUser.uid,
          email,
          displayName: name || email.split('@')[0],
          zodiacSign,
          createdAt: new Date().toISOString(),
          readingsCount: 0,
        };

        if (db) {
          try {
            await setDoc(doc(db, 'users', fbUser.uid), profile);
          } catch (e) {
            console.warn('Error writing user profile to Firestore:', e);
          }
        }

        setUser(profile);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      } else {
        // Fallback offline signup
        const profile: UserProfile = {
          uid: `user_${Date.now()}`,
          email,
          displayName: name || email.split('@')[0],
          zodiacSign,
          createdAt: new Date().toISOString(),
          readingsCount: 0,
        };
        setUser(profile);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsGuest = async (name = 'Buscador Místico', zodiacSign = 'Peixes') => {
    setIsLoading(true);
    try {
      const guestProfile: UserProfile = {
        uid: `guest_${Date.now().toString().slice(-6)}`,
        email: 'visitante@meutarot.app',
        displayName: name,
        zodiacSign,
        isAnonymous: true,
        createdAt: new Date().toISOString(),
        readingsCount: 0,
      };

      setUser(guestProfile);
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestProfile));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isFirebaseInitialized && auth) {
        await fbSignOut(auth).catch(() => {});
      }
      setUser(null);
      await AsyncStorage.removeItem(LOCAL_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    if (isFirebaseInitialized && db && user.uid && !user.isAnonymous) {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (e) {
        console.warn('Error updating profile in Firestore:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signInAsGuest,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
