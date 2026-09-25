import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, isFirebaseInitialized } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { TarotReading, DrawnCard } from '../types/tarot';

const LOCAL_STORAGE_PREFIX = '@meutarot_readings_';
const DAILY_CARD_PREFIX = '@meutarot_daily_card_';

export const StorageService = {
  /**
   * Save a reading to Firestore and local storage cache
   */
  async saveReading(reading: TarotReading): Promise<void> {
    const userId = reading.userId || 'guest';
    const localKey = `${LOCAL_STORAGE_PREFIX}${userId}`;

    // 1. Save to local storage first (instant responsiveness)
    try {
      const existingData = await AsyncStorage.getItem(localKey);
      const readings: TarotReading[] = existingData ? JSON.parse(existingData) : [];
      // Prepend the new reading
      const updated = [reading, ...readings.filter(r => r.id !== reading.id)];
      await AsyncStorage.setItem(localKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving reading to AsyncStorage:', e);
    }

    // 2. Sync to Firestore if authenticated & db is ready
    if (isFirebaseInitialized && db && userId !== 'guest') {
      try {
        const readingDocRef = doc(db, 'users', userId, 'readings', reading.id);
        await setDoc(readingDocRef, reading);
      } catch (e) {
        console.warn('Could not sync reading to Firestore (will remain in local storage):', e);
      }
    }
  },

  /**
   * Get all readings for a user (from local storage + Firestore sync)
   */
  async getReadings(userId: string): Promise<TarotReading[]> {
    const localKey = `${LOCAL_STORAGE_PREFIX}${userId || 'guest'}`;
    let localReadings: TarotReading[] = [];

    try {
      const existingData = await AsyncStorage.getItem(localKey);
      if (existingData) {
        localReadings = JSON.parse(existingData);
      }
    } catch (e) {
      console.warn('Error reading from AsyncStorage:', e);
    }

    // If online and authenticated, fetch latest from Firestore and merge
    if (isFirebaseInitialized && db && userId && userId !== 'guest') {
      try {
        const readingsCol = collection(db, 'users', userId, 'readings');
        const q = query(readingsCol, orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const firestoreReadings: TarotReading[] = [];
          snapshot.forEach((docSnapshot) => {
            firestoreReadings.push(docSnapshot.data() as TarotReading);
          });

          // Merge unique by ID
          const map = new Map<string, TarotReading>();
          [...firestoreReadings, ...localReadings].forEach((r) => map.set(r.id, r));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          await AsyncStorage.setItem(localKey, JSON.stringify(merged));
          return merged;
        }
      } catch (e) {
        console.warn('Could not fetch from Firestore, returning local readings:', e);
      }
    }

    return localReadings;
  },

  /**
   * Delete a reading
   */
  async deleteReading(userId: string, readingId: string): Promise<void> {
    const localKey = `${LOCAL_STORAGE_PREFIX}${userId || 'guest'}`;

    // Local delete
    try {
      const existingData = await AsyncStorage.getItem(localKey);
      if (existingData) {
        const readings: TarotReading[] = JSON.parse(existingData);
        const filtered = readings.filter(r => r.id !== readingId);
        await AsyncStorage.setItem(localKey, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('Error deleting from AsyncStorage:', e);
    }

    // Firestore delete
    if (isFirebaseInitialized && db && userId && userId !== 'guest') {
      try {
        const readingDocRef = doc(db, 'users', userId, 'readings', readingId);
        await deleteDoc(readingDocRef);
      } catch (e) {
        console.warn('Error deleting from Firestore:', e);
      }
    }
  },

  /**
   * Get or set daily card for a specific day
   */
  async getDailyCard(userId: string): Promise<DrawnCard | null> {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `${DAILY_CARD_PREFIX}${userId || 'guest'}_${todayStr}`;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error getting daily card:', e);
    }
    return null;
  },

  async saveDailyCard(userId: string, drawnCard: DrawnCard): Promise<void> {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `${DAILY_CARD_PREFIX}${userId || 'guest'}_${todayStr}`;
      await AsyncStorage.setItem(key, JSON.stringify(drawnCard));
    } catch (e) {
      console.warn('Error saving daily card:', e);
    }
  },
};
