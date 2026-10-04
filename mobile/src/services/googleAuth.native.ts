import { GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { auth, isFirebaseInitialized } from './firebase';

let GoogleSigninModule: any = null;
let statusCodesObj: any = null;
let isConfigured = false;

function getGoogleSignin() {
  if (!GoogleSigninModule) {
    try {
      // Lazy load to prevent crashes in Expo Go where native module is not present
      // In Expo Go, @react-native-google-signin/google-signin throws TurboModuleRegistry error on import
      // Wrapping in try/catch ensures the app boots normally in Expo Go.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pkg = require('@react-native-google-signin/google-signin');
      GoogleSigninModule = pkg.GoogleSignin;
      statusCodesObj = pkg.statusCodes;
    } catch {
      return null;
    }
  }
  return GoogleSigninModule;
}

function ensureConfigured(GoogleSignin: any) {
  if (!isConfigured && GoogleSignin) {
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

  const GoogleSignin = getGoogleSignin();
  if (!GoogleSignin) {
    throw new Error(
      'O login nativo com Google requer um Development Build (EAS Build). No Expo Go, entre com E-mail/Senha ou use o Modo Visitante Místico!'
    );
  }

  try {
    ensureConfigured(GoogleSignin);
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
    const codes = statusCodesObj || {};
    if (codes.SIGN_IN_CANCELLED && error?.code === codes.SIGN_IN_CANCELLED) {
      throw new Error('Login cancelado pelo usuário.');
    } else if (codes.IN_PROGRESS && error?.code === codes.IN_PROGRESS) {
      throw new Error('Operação de login com Google em andamento.');
    } else if (codes.PLAY_SERVICES_NOT_AVAILABLE && error?.code === codes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services indisponível ou desatualizado.');
    } else if (
      error?.message?.includes('RNGoogleSignin') ||
      error?.message?.includes('TurboModuleRegistry') ||
      error?.message?.includes('null') ||
      error?.code === '12500'
    ) {
      throw new Error(
        'O login nativo com Google requer um Development Build (EAS Build). No Expo Go, utilize E-mail/Senha ou o Modo Visitante.'
      );
    }
    throw error;
  }
}
