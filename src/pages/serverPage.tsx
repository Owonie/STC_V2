import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  createRoomServer,
  deleteRoomServer,
  syncRoomServerList,
} from '../services/roomServerService';
import { roomServerListState } from '../states/roomServerState';
import { authState, userState } from '../states/accountState';
import { RoomServer } from '../type/dataType';

const ServerPage = () => {
  const [roomServerList, setRoomServerList] =
    useRecoilState(roomServerListState);
  const isAuthed = useRecoilValue(authState);
  const { userUID, displayName } = useRecoilValue(userState);

  useEffect(() => {
    const stopSync = syncRoomServerList(
      userUID,
      (roomServerListData: RoomServer[]): void => {
        setRoomServerList(roomServerListData);
      }
    );

    return () => {
      stopSync();
    };
  }, [isAuthed, userUID, setRoomServerList]);

  return (
    <div>
      Server
      {Object.values(roomServerList).map((room) => (
        <button
          key={room.roomServerUID}
          onClick={() => deleteRoomServer(userUID, room.roomServerUID)}
        >
          {room.roomServerName},{room.roomServerUID} 제거하기
        </button>
      ))}
      <div>
        <button
          onClick={() => createRoomServer(userUID, displayName, 'Owon Room')}
        >
          방 만들기!
        </button>
      </div>
    </div>
  );
};

export default ServerPage;
