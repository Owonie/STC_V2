import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  createRoomServer,
  deleteRoomServer,
  syncRoomServerList,
} from '../services/roomServerService';
import { roomServerListState } from '../states/roomServerState';
import { authState } from '../states/accountState';
import { RoomServer } from '../type/dataType';

const ServerPage = () => {
  const [roomServerList, setRoomServerList] =
    useRecoilState(roomServerListState);
  const isAuthed = useRecoilValue(authState);

  const userUID = 'Owon';
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
  }, [isAuthed, setRoomServerList]);

  return (
    <div>
      Server
      {Object.values(roomServerList).map((room) => (
        <button
          key={room.roomServerUID}
          onClick={() => deleteRoomServer('Owon', room.roomServerUID)}
        >
          {room.roomServerName} 제거하기
        </button>
      ))}
      <div>
        <button onClick={() => createRoomServer('Owon', 'Owon Room')}>
          방 만들기!
        </button>
      </div>
    </div>
  );
};

export default ServerPage;
