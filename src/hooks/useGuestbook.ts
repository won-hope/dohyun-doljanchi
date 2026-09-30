'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: number;
}

export function useGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestbookEntry[];
      
      setEntries(newEntries);
      setLoading(false);
    }, (error) => {
      console.error("Guestbook fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteEntry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'guestbook', id));
      return true;
    } catch (error) {
      console.error("Error deleting entry:", error);
      return false;
    }
  };

  return { entries, loading, deleteEntry };
}
