import { signOut, signInWithPopup } from 'firebase/auth';
import { auth, authProvider } from './firebase';

export async function login(providerName: string) {
  const provider = getProvider(providerName);
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      return user;
    })
    .catch(console.error);
}

export async function logout() {
  return signOut(auth).then(() => null);
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
