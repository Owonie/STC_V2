import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { CurrentRoomServer, RoomServer } from '../type/dataType';

const { persistAtom } = recoilPersist();

export const currentRoomServerState = atom<CurrentRoomServer>({
  key: 'currentRoomServerState',
  default: { isInRoomServer: false },
  effects_UNSTABLE: [persistAtom],
});

export const roomServerListState = atom<RoomServer[]>({
  key: 'roomServerListState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
