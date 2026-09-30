import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RsvpEntry } from '@/types';

export function useRsvp() {
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'rsvp'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RsvpEntry[];
      setEntries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addRsvp = async (data: Omit<RsvpEntry, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'rsvp'), {
      ...data,
      createdAt: Date.now(),
    });
  };

  const deleteRsvp = async (id: string) => {
    await deleteDoc(doc(db, 'rsvp', id));
  };

  return { entries, loading, addRsvp, deleteRsvp };
}
