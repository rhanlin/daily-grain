import { collection, onSnapshot, doc, setDoc, query, where } from 'firebase/firestore';
import { db as firestore } from './firebase';
import { db as localDb } from './db';
import { auth } from './firebase';

export const startSync = (userId: string) => {
  const collections = ['categories', 'tasks', 'subtasks', 'dailyPlanItems'];

  collections.forEach((colName) => {
    // 1. Listen to Firestore and update Dexie
    const q = query(collection(firestore, `users/${userId}/${colName}`));
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const remoteData = change.doc.data();
        const localItem = await (localDb as any)[colName].get(change.doc.id);

        if (!localItem || new Date(remoteData.updatedAt) > new Date(localItem.updatedAt)) {
          await (localDb as any)[colName].put({ ...remoteData, id: change.doc.id });
        }
      });
    });
  });

  // 2. Watch Dexie and push to Firestore
  // Note: For a more robust solution, we'd use a dedicated "outbox" table
  // For MVP, we'll use Dexie's middleware or simple hooks.
  // Using hooks for specific entities in the UI or repository is easier for now.
};

export const pushToFirestore = async (colName: string, data: any) => {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(firestore, `users/${user.uid}/${colName}`, data.id);
  await setDoc(docRef, data, { merge: true });
};
