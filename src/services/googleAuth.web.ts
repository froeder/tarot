import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth, isFirebaseInitialized } from './firebase';

export async function loginWithGoogle(): Promise<User> {
  if (!isFirebaseInitialized || !auth) {
    throw new Error('Firebase não está inicializado.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}
