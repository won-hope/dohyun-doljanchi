'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface QuizSubmission {
  id: string;
  name: string;
  answerIndex: number;
  isCorrect: boolean;
  comment?: string;
  createdAt: number;
  isWinner?: boolean;
  phone?: string;
}

export function useQuiz() {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'quiz_votes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as QuizSubmission[];
      setSubmissions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSubmission = async (id: string, data: Partial<QuizSubmission>) => {
    try {
      await updateDoc(doc(db, 'quiz_votes', id), data);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return { submissions, loading, updateSubmission };
}
