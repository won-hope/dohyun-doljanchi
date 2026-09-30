'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DoljabiItems {
  [key: string]: number;
}

const INITIAL_ITEMS: DoljabiItems = {
  money: 0,
  stethoscope: 0,
  gavel: 0,
  yarn: 0,
  microphone: 0,
  pencil: 0
};

export function useDoljabi() {
  const [votes, setVotes] = useState<DoljabiItems>(INITIAL_ITEMS);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for voting status
    if (typeof window !== 'undefined') {
      const voted = localStorage.getItem('hasVotedDoljabi');
      if (voted) setHasVoted(true);
    }

    const docRef = doc(db, 'doljabi_votes', 'results');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setVotes(docSnap.data() as DoljabiItems);
      } else {
        setDoc(docRef, INITIAL_ITEMS).catch(console.error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const castVote = async (itemId: string) => {
    if (hasVoted) return false;
    try {
      const docRef = doc(db, 'doljabi_votes', 'results');
      await updateDoc(docRef, {
        [itemId]: increment(1)
      });
      setHasVoted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasVotedDoljabi', 'true');
      }
      return true;
    } catch (error) {
      console.error("Vote failed:", error);
      return false;
    }
  };

  return { votes, hasVoted, castVote, loading };
}
