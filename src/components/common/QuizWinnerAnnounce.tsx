'use client';
import { useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function QuizWinnerAnnounce() {
  const { submissions, loading, updateSubmission } = useQuiz();
  const [selectedWinnerId, setSelectedWinnerId] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return null;

  const winners = submissions.filter(s => s.isWinner);
  if (winners.length === 0) return null;

  const handleSubmit = async () => {
    if (!selectedWinnerId) return alert('이름을 선택해주세요.');
    if (!phone.trim()) return alert('연락처를 입력해주세요.');
    setIsSubmitting(true);
    await updateSubmission(selectedWinnerId, { phone: phone.trim() });
    setIsSubmitting(false);
    alert('연락처가 전송되었습니다! 곧 선물을 보내드릴게요 🎁');
    setSelectedWinnerId('');
    setPhone('');
  };

  return (
    <section className="py-12 px-6 max-w-md mx-auto text-center border-t border-line/60">
      <Reveal>
        <SectionHeading
          eyebrow="EVENT WINNER"
          title="깜짝 퀴즈 당첨자"
          description="퀴즈 정답을 맞추신 분들 중 행운의 당첨자를 발표합니다!"
        />
        
        <div className="bg-paper-deep rounded-2xl p-6 border border-line/80 mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {winners.map(w => (
              <span key={w.id} className="inline-block px-4 py-2 bg-white text-ink font-bold rounded-full shadow-sm text-lg">
                🎉 {w.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="font-bold text-ink mb-4">당첨자 선물 수령 연락처 남기기</h3>
          <p className="text-sm text-mute mb-4">당첨되신 분들은 선물을 받으실 연락처를 남겨주세요!</p>
          
          <div className="space-y-3 text-left">
            <select 
              value={selectedWinnerId} 
              onChange={e => setSelectedWinnerId(e.target.value)}
              className="w-full min-h-[52px] px-4 rounded-xl border border-line bg-paper text-ink"
            >
              <option value="">당첨자 이름 선택</option>
              {winners.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>

            <input 
              type="tel" 
              placeholder="연락처 (예: 010-1234-5678)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full min-h-[52px] px-4 rounded-xl border border-line bg-paper text-ink placeholder:text-mute/70"
            />

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedWinnerId || !phone.trim()}
              className="w-full min-h-[52px] rounded-xl bg-ink text-paper text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-40 mt-2"
            >
              {isSubmitting ? '전송 중...' : '연락처 전송하기'}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
