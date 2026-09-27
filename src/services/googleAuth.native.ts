import { GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { auth, isFirebaseInitialized } from './firebase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

let isConfigured = false;

function ensureConfigured() {
  if (!isConfigured) {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    GoogleSignin.configure({
      webClientId: webClientId || undefined,
      offlineAccess: false,
    });
    isConfigured = true;
  }
}

export async function loginWithGoogle(): Promise<User> {
  if (!isFirebaseInitialized || !auth) {
    throw new Error('Firebase não está inicializado.');
  }

  try {
    ensureConfigured();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response?.data?.idToken || (response as any)?.idToken;

    if (!idToken) {
      throw new Error('Não foi possível obter o token de identificação do Google.');
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const userCred = await signInWithCredential(auth, credential);
    return userCred.user;
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Login cancelado pelo usuário.');
    } else if (error?.code === statusCodes.IN_PROGRESS) {
      throw new Error('Operação de login com Google em andamento.');
    } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services indisponível ou desatualizado.');
    } else if (
      error?.message?.includes('RNGoogleSignin') ||
      error?.message?.includes('null') ||
      error?.code === '12500'
    ) {
      throw new Error(
        'O login nativo com Google requer um Development Build (EAS Build ou prebuild com SHA-1). Na versão web ou hospedada, utilize o navegador.'
      );
    }
    throw error;
  }
}
