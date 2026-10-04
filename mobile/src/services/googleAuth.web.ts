import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
  User,
} from 'firebase/auth';
import { auth, isFirebaseInitialized } from './firebase';

export async function loginWithGoogle(): Promise<User> {
  if (!isFirebaseInitialized || !auth) {
    throw new Error('Firebase não está inicializado.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  try {
    const credential = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    return credential.user;
  } catch (error: any) {
    console.error('Erro no signInWithPopup Google:', error);

    // Se o popup for bloqueado pelo navegador, tenta o fluxo de redirecionamento transparente
    if (error?.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
        // O navegador será redirecionado para a página do Google
        throw new Error('Redirecionando para o login do Google...');
      } catch (redirectError: any) {
        throw redirectError;
      }
    }

    if (error?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'este domínio';
      throw new Error(
        `O domínio "${currentHost}" não está autorizado no Firebase Authentication. Adicione "${currentHost}" em Firebase Console > Authentication > Settings > Authorized domains.`
      );
    }

    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('A janela de login do Google foi fechada antes de concluir.');
    }

    if (error?.code === 'auth/cancelled-popup-request') {
      throw new Error('Outra tentativa de login já está em andamento. Aguarde um instante.');
    }

    throw error;
  }
}

export async function checkRedirectResult(): Promise<User | null> {
  if (!isFirebaseInitialized || !auth) return null;
  try {
    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
    return result ? result.user : null;
  } catch (error) {
    console.warn('Erro ao verificar redirect Google:', error);
    return null;
  }
}

