'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InvitationConfig } from '@/types';

const DEFAULT_CONFIG: InvitationConfig = {
  selectedTemplate: 'EDITORIAL',
  mainCoverImage: '',
  coverFocusY: 30,
  scrollImages: [],
  babyName: '도현',
  date: '2023-10-31',
  time: '12:30',
  locationName: '고궁 한정식',
  locationAddress: '강원도 원주시 운곡로 242 (1~2층)',
  locationAddressDetail: '지번: 행구동 393',
  parkingInfo: '',
  greetingMessage: '도현이가 태어난 지 어느덧 1년이 되었습니다.\n건강하게 자랄 수 있도록 관심과 사랑으로 지켜봐 주신 분들을 모시고\n작은 잔치를 열고자 하오니 참석하시어 자리를 빛내주시면 감사하겠습니다.',
  fatherName: '아빠이름',
  fatherPhone: '010-0000-0000',
  motherName: '엄마이름',
  motherPhone: '010-0000-0000',
  quizQuestion: '도현이가 태어날 때 몸무게는 얼마였을까요?',
  quizOptions: ['2.8kg', '3.2kg', '3.6kg', '4.0kg'],
  quizAnswerIndex: 1,
  bgmUrl: '',
  galleryImages: [],
  tmiItems: [
    { id: '1', question: '도현이의 태몽은?', answer: '커다란 황금돼지가 품에 안기는 꿈이었어요!' },
    { id: '2', question: '가장 좋아하는 것은?', answer: '아빠 얼굴 보고 꺄르르 웃기' }
  ],
  eventMode: 'INVITATION',
  audioGreetingUrl: '',
  useStory: true,
  useGallery: true,
  useTmi: true,
  useRsvp: true,
  useQuiz: true,
  useGuestbook: true,
};

export function useInvitationData() {
  const [config, setConfig] = useState<InvitationConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'invitation_config', 'settings');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({ ...DEFAULT_CONFIG, ...data } as InvitationConfig);
      } else {
        setDoc(docRef, DEFAULT_CONFIG).catch(console.error);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore read error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: Partial<InvitationConfig>) => {
    try {
      const docRef = doc(db, 'invitation_config', 'settings');
      await setDoc(docRef, { ...config, ...newConfig }, { merge: true });
      return true;
    } catch (error) {
      console.error("Error updating config:", error);
      return false;
    }
  };

  return { config, loading, updateConfig };
}
