import {
  addDoc,
  doc,
  setDoc,
  collection,
  onSnapshot,
  query,
  runTransaction,
} from 'firebase/firestore';
import { database } from '../firebase';
import { RoomServer } from '../type/dataType';

type OnUpdate = (roomServerListData: RoomServer[]) => void;

export function syncRoomServerList(userUID: string, onUpdate: OnUpdate) {
  const ref = collection(database, `User/${userUID}/RoomServerList`);
  const q = query(ref);
  const unsub = onSnapshot(q, (snapshot) => {
    const roomServerListData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      roomServerName: doc.data().roomServerName,
    }));
    roomServerListData && onUpdate(roomServerListData);
  });
  return () => unsub();
}

export async function createRoomServer(
  userUID: string,
  roomServerName: string
) {
  const transaction = await runTransaction(database, async (transaction) => {
    addDoc(collection(database, 'RoomServer'), {
      RoomServerName: roomServerName,
      masterUID: userUID,
    }).then((result) => {
      const roomServerListRef = collection(
        database,
        `User/${userUID}/RoomServerList`
      );

      setDoc(doc(roomServerListRef, result.id), {
        roomServerName: roomServerName,
      });
    });
    return transaction;
  });

  return transaction;
}

// export function deleteRoomServer(userUID: string, roomServerUID) {}
