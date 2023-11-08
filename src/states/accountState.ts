import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { User } from '../type/dataType';

const { persistAtom } = recoilPersist();

export const authState = atom<boolean>({
  key: 'authState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userState = atom<User>({
  key: 'userState',
  default: {
    displayName: '',
    photoURL: '',
    accessToken: '',
    userUID: '',
  },
  effects_UNSTABLE: [persistAtom],
});
