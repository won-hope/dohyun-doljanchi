'use client';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import { useGuestbook } from '@/hooks/useGuestbook';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const FIELD = 'w-full px-4 rounded-xl border border-line bg-paper text-ink placeholder:text-mute/70';
const PAGE_SIZE = 5;

export default function Guestbook() {
  const { entries, loading } = useGuestbook();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: Date.now()
      });
      setName('');
      setMessage('');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true });
      alert('타임캡슐이 안전하게 봉인되었습니다! 💌');
    } catch (error) {
      console.error(error);
      alert('등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-12 px-6 max-w-md mx-auto">
      <Reveal>
        <SectionHeading
          eyebrow="TIME CAPSULE"
          title="20살의 도현이에게"
          description="먼 훗날 성인이 된 도현이가 열어볼 수 있도록 따뜻한 덕담과 편지를 남겨주세요."
        />

        <form onSubmit={handleSubmit} className="space-y-3 mb-12">
          <input
            type="text"
            aria-label="작성자 이름"
            placeholder="작성자 이름"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={10}
            className={`${FIELD} min-h-[52px]`}
          />
          <textarea
            aria-label="편지 내용"
            placeholder="20년 후의 도현이에게 어떤 말을 해주고 싶나요?"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            maxLength={300}
            className={`${FIELD} py-3 resize-none leading-relaxed`}
          />
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !message.trim()}
            className="w-full min-h-[56px] rounded-xl bg-ink text-paper text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isSubmitting ? '봉인 중...' : '타임캡슐 봉인하기'}
          </button>
        </form>

        {loading ? (
          <p className="text-center text-base text-mute">타임캡슐을 불러오는 중입니다...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-base text-mute py-6">아직 봉인된 편지가 없습니다.</p>
        ) : (
          <>
            <ul className="divide-y divide-line border-y border-line">
              {entries.slice(0, visibleCount).map((entry) => (
                <li key={entry.id} className="py-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-base font-bold">{entry.name}</span>
                    <time className="text-sm text-mute">{new Date(entry.createdAt).toLocaleDateString()}</time>
                  </div>
                  <p className="text-[17px] whitespace-pre-wrap leading-[1.8]">{entry.message}</p>
                </li>
              ))}
            </ul>
            {entries.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="mt-4 w-full min-h-[52px] rounded-xl border border-line text-base font-medium text-ink hover:bg-paper-deep"
              >
                편지 더 보기 ({entries.length - visibleCount})
              </button>
            )}
          </>
        )}
      </Reveal>
    </section>
  );
}
