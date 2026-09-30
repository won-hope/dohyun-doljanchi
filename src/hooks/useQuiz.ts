'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface QuizSubmission {
  id: string;
  name: string;
  answerIndex: number;
  isCorrect: boolean;
  comment?: string;
  createdAt: number;
}

export function useQuiz() {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'quiz_votes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuizSubmission[];
      setSubmissions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { submissions, loading };
}
