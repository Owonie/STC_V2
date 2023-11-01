import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface UserState {
  displayName: string;
  photoURL: string;
  accessToken: string;
}

export const authState = atom<boolean>({
  key: 'authState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userState = atom<UserState>({
  key: 'userState',
  default: { displayName: '', photoURL: '', accessToken: '' },
  effects_UNSTABLE: [persistAtom],
});
