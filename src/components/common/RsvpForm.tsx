'use client';
import { InvitationConfig } from '@/types';
import { useRsvp } from '@/hooks/useRsvp';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RsvpForm({ config }: { config: InvitationConfig }) {
  const { addRsvp } = useRsvp();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [isAttending, setIsAttending] = useState(true);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [needBabyChair, setNeedBabyChair] = useState(false);

  if (!config.useRsvp) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addRsvp({
        name,
        isAttending,
        adultCount: isAttending ? adultCount : 0,
        childCount: isAttending ? childCount : 0,
        needBabyChair: isAttending ? needBabyChair : false
      });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      alert('참석 여부가 전달되었습니다. 감사합니다! 💛');
      setIsOpen(false);
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-16 px-6 max-w-md mx-auto">
      <div className="bg-current/5 border border-current/10 p-6 rounded-3xl text-center">
        <h2 className="text-xl font-bold mb-2">참석 여부 전달하기</h2>
        <p className="text-sm opacity-70 mb-6 leading-relaxed">
          원활한 행사 준비를 위해<br/>참석 여부를 미리 알려주시면 감사하겠습니다.
        </p>
        
        {!isOpen ? (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full py-4 rounded-xl bg-current text-white dark:text-black font-bold border border-current transition hover:scale-[1.02]"
            style={{ color: 'var(--bg-color)', backgroundColor: 'var(--text-color)' }}
          >
            참석 여부 응답하기
          </button>
        ) : (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSubmit}
            className="text-left space-y-5"
          >
            <div>
              <label className="block text-xs font-bold opacity-80 mb-1">성함</label>
              <input 
                type="text" 
                value={name} onChange={e => setName(e.target.value)}
                placeholder="예) 홍길동"
                required
                className="w-full p-3 rounded-lg bg-current/5 border border-transparent focus:border-current/30 outline-none text-sm transition"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold opacity-80 mb-2">참석 여부</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setIsAttending(true)} className={`p-3 rounded-lg text-sm font-bold border transition ${isAttending ? 'bg-current/10 border-current/30' : 'bg-transparent border-current/10 opacity-50'}`}>참석</button>
                <button type="button" onClick={() => setIsAttending(false)} className={`p-3 rounded-lg text-sm font-bold border transition ${!isAttending ? 'bg-current/10 border-current/30' : 'bg-transparent border-current/10 opacity-50'}`}>마음으로 축하</button>
              </div>
            </div>

            {isAttending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2">
                <div className="flex justify-between items-center bg-current/5 p-3 rounded-lg">
                  <span className="text-sm font-bold opacity-80">어른 인원</span>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="text-xl opacity-50 hover:opacity-100">-</button>
                    <span className="w-4 text-center text-sm font-bold">{adultCount}</span>
                    <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="text-xl opacity-50 hover:opacity-100">+</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-current/5 p-3 rounded-lg">
                  <span className="text-sm font-bold opacity-80">아이 인원</span>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setChildCount(Math.max(0, childCount - 1))} className="text-xl opacity-50 hover:opacity-100">-</button>
                    <span className="w-4 text-center text-sm font-bold">{childCount}</span>
                    <button type="button" onClick={() => setChildCount(childCount + 1)} className="text-xl opacity-50 hover:opacity-100">+</button>
                  </div>
                </div>

                {childCount > 0 && (
                  <label className="flex items-center gap-2 bg-current/5 p-3 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={needBabyChair} onChange={e => setNeedBabyChair(e.target.checked)} className="w-4 h-4 accent-current" />
                    <span className="text-sm font-bold opacity-80">아기의자가 필요해요</span>
                  </label>
                )}
              </motion.div>
            )}

            <div className="flex gap-2 pt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 rounded-xl border border-current/20 font-bold opacity-70">취소</button>
              <button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1 py-3 rounded-xl font-bold bg-current text-white dark:text-black opacity-90 hover:opacity-100 disabled:opacity-50" style={{ color: 'var(--bg-color)', backgroundColor: 'var(--text-color)' }}>
                {isSubmitting ? '전달 중...' : '제출하기'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
