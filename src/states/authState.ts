import { atom } from 'recoil';

export const authState = atom<string | null>({
  key: 'AuthState',
  default: '',
});
