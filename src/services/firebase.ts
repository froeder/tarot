import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
} from 'firebase/auth';
// @ts-ignore - React Native specific persistence from Firebase RN distribution
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration loaded from environment variables (EXPO_PUBLIC_*)
export const defaultFirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "frojho-tarot.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "frojho",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "frojho.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  databaseId: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_ID || "frojho-tarot",
  hostingUrl: process.env.EXPO_PUBLIC_FIREBASE_HOSTING_URL || "https://frojho-tarot.web.app",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseInitialized = false;

export async function getStoredFirebaseConfig() {
  try {
    const customConfig = await AsyncStorage.getItem('@meutarot_firebase_config');
    if (customConfig) {
      return JSON.parse(customConfig);
    }
  } catch (e) {
    console.warn('Error reading stored firebase config', e);
  }
  return defaultFirebaseConfig;
}

export async function saveCustomFirebaseConfig(config: typeof defaultFirebaseConfig) {
  try {
    await AsyncStorage.setItem('@meutarot_firebase_config', JSON.stringify(config));
    // Re-initialize with new config
    initFirebase(config);
  } catch (e) {
    console.warn('Error saving custom firebase config', e);
  }
}

export function initFirebase(config = defaultFirebaseConfig) {
  try {
    const hasValidCredentials = Boolean(config.apiKey && config.projectId);

    if (hasValidCredentials) {
      const targetDatabase = config.databaseId || 'frojho-tarot';

      if (!getApps().length) {
        app = initializeApp(config);
        try {
          if (Platform.OS === 'web') {
            auth = getAuth(app);
          } else {
            auth = initializeAuth(app, {
              persistence: getReactNativePersistence(AsyncStorage),
            });
          }
        } catch {
          auth = getAuth(app);
        }
        db = getFirestore(app, targetDatabase);
        isFirebaseInitialized = true;
      } else {
        app = getApp();
        auth = getAuth(app);
        db = getFirestore(app, targetDatabase);
        isFirebaseInitialized = true;
      }
    } else {
      isFirebaseInitialized = false;
    }
  } catch (error) {
    console.warn('Firebase initialization with given config failed or running in demo mode:', error);
    isFirebaseInitialized = false;
  }

  return { app, auth, db, isFirebaseInitialized };
}

// Initial bootstrap
initFirebase();

export { app, auth, db, isFirebaseInitialized };
