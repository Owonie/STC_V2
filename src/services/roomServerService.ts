import {
  addDoc,
  setDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
import { database } from '../firebase';
import { RoomServer } from '../type/dataType';

type OnUpdate = (roomServerListData: RoomServer[]) => void;

export function syncRoomServerList(userUID: string, onUpdate: OnUpdate) {
  const ref = collection(database, `User/${userUID}/RoomServerList`);
  const q = query(ref, where('isDeleted', '==', false));
  const unsub = onSnapshot(q, (snapshot) => {
    const roomServerListData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      roomServerName: doc.data().roomServerName,
      roomServerUID: doc.id,
    }));
    roomServerListData && onUpdate(roomServerListData);
  });
  return () => unsub();
}

export function createRoomServer(userUID: string, roomServerName: string) {
  addDoc(collection(database, 'RoomServer'), {
    RoomServerName: roomServerName,
    masterUID: userUID,
    isDeleted: false,
  }).then((result) => {
    const roomServerListRef = collection(
      database,
      `User/${userUID}/RoomServerList`
    );
    setDoc(doc(roomServerListRef, result.id), {
      roomServerName: roomServerName,
      isDeleted: false,
    });
  });
}

export function deleteRoomServer(userUID: string, roomServerUID: string) {
  const userRef = doc(
    database,
    `User/${userUID}/RoomServerList/${roomServerUID}`
  );
  const roomServerListRef = doc(database, `RoomServer/${roomServerUID}`);

  try {
    runTransaction(database, async (transaction) => {
      const roomServerListDoc = await transaction.get(roomServerListRef);
      const userDoc = await transaction.get(userRef);
      if (!roomServerListDoc && !userDoc) {
        throw 'Something is error on database!';
      }
      transaction
        .set(userRef, { isDeleted: true }, { merge: true })
        .set(roomServerListRef, { isDeleted: true }, { merge: true });
    });
  } catch (e) {
    console.error(e);
  }
}
