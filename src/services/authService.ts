import {
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth, authProvider } from '../firebase';

export async function login(providerName: string) {
  const provider = getProvider(providerName);

  return signInWithPopup(auth, provider)
    .then((result) => {
      let credential;
      if (providerName === 'Google') {
        credential = GoogleAuthProvider.credentialFromResult(result);
      } else {
        credential = GithubAuthProvider.credentialFromResult(result);
      }

      const accessToken = credential?.accessToken;

      const user = {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        userUID: result.user.uid,
        accessToken: accessToken,
      };
      return user;
    })
    .catch((error) => {
      console.error('login failed', error);
    });
}

export async function logout() {
  return signOut(auth).catch(console.error);
}

function getProvider(providerName: string) {
  switch (providerName) {
    case 'Google':
      return authProvider[providerName];
    case 'Github':
      return authProvider[providerName];
    default:
      throw new Error(`There is no ${providerName} provider!`);
  }
}
