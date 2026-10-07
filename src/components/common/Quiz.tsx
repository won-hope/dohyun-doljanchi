'use client';
import { useState, useEffect } from 'react';
import { InvitationConfig } from '@/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const FIELD = 'w-full min-h-[52px] px-4 rounded-xl border border-line bg-paper text-ink placeholder:text-mute/70';

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
    <section id="quiz" className="py-12 px-6 max-w-md mx-auto">
      <Reveal>
        <SectionHeading
          eyebrow="QUIZ"
          title="깜짝 퀴즈 이벤트"
          description="정답을 맞추신 분들 중 추첨을 통해 소정의 선물을 드립니다."
        />

        <p className="text-lg font-bold leading-relaxed text-ink mb-5">
          <span className="text-accent mr-2">Q.</span>
          {config.quizQuestion || '퀴즈 문제가 준비되지 않았습니다.'}
        </p>

        <div className="space-y-2 mb-6" role="radiogroup" aria-label="퀴즈 보기">
          {(config.quizOptions || []).map((opt, idx) => {
            const active = selectedOpt === idx;
            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={hasVoted}
                onClick={() => setSelectedOpt(idx)}
                className={`w-full min-h-[56px] px-4 rounded-xl border text-left text-[17px] font-medium flex items-center gap-3 transition-colors ${
                  active ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-line hover:bg-paper-deep'
                } ${hasVoted ? 'opacity-70 cursor-default' : ''}`}
              >
                <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                  active ? 'bg-paper text-ink' : 'bg-paper-deep text-mute'
                }`}>
                  {idx + 1}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {!hasVoted ? (
          <div className="space-y-3">
            <input
              type="text"
              aria-label="참여자 이름"
              placeholder="참여자 이름 (예: 이모, 삼촌, 친구이름)"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={10}
              className={FIELD}
            />
            <textarea
              aria-label="축하 한마디"
              placeholder="도현이에게 전하는 축하 한마디 (선택)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={2}
              maxLength={100}
              className={`${FIELD} py-3 resize-none`}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full min-h-[56px] rounded-xl bg-ink text-paper text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isSubmitting ? '제출 중...' : '정답 및 코멘트 남기기'}
            </button>
          </div>
        ) : (
          showResult && (
            <div role="status" className="rounded-xl border border-line bg-paper-deep p-6 text-center">
              <p className="font-display text-xl font-semibold mb-1">
                {isCorrect ? '정답입니다!' : '아쉽지만 오답이에요!'}
              </p>
              <p className="text-base text-mute">참여해 주셔서 감사합니다.</p>
            </div>
          )
        )}
      </Reveal>
    </section>
  );
}
