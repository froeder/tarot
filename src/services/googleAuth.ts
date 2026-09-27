import { User } from 'firebase/auth';
import { Platform } from 'react-native';

export async function loginWithGoogle(): Promise<User> {
  if (Platform.OS === 'web') {
    const { loginWithGoogle: webLogin } = await import('./googleAuth.web');
    return webLogin();
  } else {
    const { loginWithGoogle: nativeLogin } = await import('./googleAuth.native');
    return nativeLogin();
  }
}
