'use client';
import confetti from 'canvas-confetti';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvitationConfig } from '@/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Quiz({ config }: { config: InvitationConfig }) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const voted = localStorage.getItem('hasVotedQuiz');
      if (voted) setHasVoted(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('참여하실 이름을 입력해주세요!');
      return;
    }
    if (selectedOpt === null) {
      alert('정답을 선택해주세요!');
      return;
    }

    setIsSubmitting(true);
    const isCorrect = selectedOpt === config.quizAnswerIndex;

    try {
      await addDoc(collection(db, 'quiz_votes'), {
        name: name.trim(),
        answerIndex: selectedOpt,
        isCorrect,
        comment: comment.trim(),
        createdAt: Date.now()
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasVotedQuiz', 'true');
      }
      setHasVoted(true);
      setShowResult(true);
    } catch (error) {
      console.error(error);
      alert('참여에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCorrect = selectedOpt === config.quizAnswerIndex;

  return (
    <section className="py-20 px-6 max-w-md mx-auto relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 relative z-10"
      >
        <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          Special Event 🎉
        </span>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">깜짝 퀴즈 이벤트!</h2>
        <p className="text-sm text-gray-600 mb-6 bg-white/70 p-4 rounded-xl border border-gray-100 backdrop-blur-sm shadow-sm inline-block">
          정답을 맞추신 분들 중 추첨을 통해<br/>소정의 선물을 드립니다 🎁
        </p>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-left">
          <p className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">
            <span className="text-blue-500 font-extrabold mr-2">Q.</span>
            {config.quizQuestion || '퀴즈 문제가 준비되지 않았습니다.'}
          </p>
          
          <div className="space-y-3 mb-6">
            {(config.quizOptions || []).map((opt, idx) => (
              <button
                key={idx}
                disabled={hasVoted}
                onClick={() => setSelectedOpt(idx)}
                className={`w-full p-4 rounded-xl text-left font-bold transition-all border-2 flex items-center ${
                  selectedOpt === idx 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-300'
                } ${hasVoted ? 'opacity-80 cursor-default' : ''}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                  selectedOpt === idx ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                {opt}
              </button>
            ))}
          </div>

          {!hasVoted ? (
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="참여자 이름 (예: 이모, 삼촌, 친구이름)" 
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={10}
                className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:border-gray-300 focus:bg-white focus:ring-0 text-sm outline-none transition text-center font-bold"
              />
              <textarea 
                placeholder="도현이에게 전하는 축하 한마디 💛 (선택)" 
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={2}
                maxLength={100}
                className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:border-gray-300 focus:bg-white focus:ring-0 text-sm outline-none transition text-center resize-none"
              />
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition disabled:opacity-50"
              >
                {isSubmitting ? '제출 중...' : '정답 및 코멘트 남기기'}
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {showResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-2xl text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                >
                  <p className="text-3xl mb-2">{isCorrect ? '🎉' : '🥲'}</p>
                  <p className="font-bold text-lg mb-1">{isCorrect ? '정답입니다!' : '아쉽지만 오답이에요!'}</p>
                  <p className="text-sm opacity-80">참여해주셔서 감사합니다.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </section>
  );
}
