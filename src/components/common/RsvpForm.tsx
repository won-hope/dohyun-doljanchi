'use client';
import { InvitationConfig } from '@/types';
import { useRsvp } from '@/hooks/useRsvp';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const FIELD = 'w-full min-h-[52px] px-4 rounded-xl border border-line bg-paper text-ink placeholder:text-mute/70';
const PRIMARY_BTN =
  'w-full min-h-[56px] rounded-xl bg-ink text-paper text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-40';

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line px-4 py-2">
      <span className="text-base font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`${label} 줄이기`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-11 h-11 rounded-full text-2xl text-ink hover:bg-paper-deep"
        >
          −
        </button>
        <span className="w-8 text-center text-lg font-bold" aria-live="polite">{value}</span>
        <button
          type="button"
          aria-label={`${label} 늘리기`}
          onClick={() => onChange(value + 1)}
          className="w-11 h-11 rounded-full text-2xl text-ink hover:bg-paper-deep"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function RsvpForm({ config }: { config: InvitationConfig }) {
  const { addRsvp } = useRsvp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true });
      alert('참석 여부가 전달되었습니다. 감사합니다! 💛');
      setIsSubmitted(true);
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const choiceClass = (active: boolean) =>
    `min-h-[52px] rounded-xl border text-base font-bold transition-colors ${
      active ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-line hover:bg-paper-deep'
    }`;

  if (isSubmitted) {
    
    return (
      <section id="rsvp" className="py-[72px] px-6 max-w-md mx-auto text-center">
        <Reveal>
          <div className="p-1 mb-8 rounded-3xl bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 shadow-xl overflow-hidden relative">
            <div className="bg-paper rounded-[20px] p-6 text-center border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-blue-300"></div>
              
              <div className="flex justify-between items-center mb-6 border-b border-dashed border-gray-300 pb-4">
                <span className="text-xs font-bold text-gray-400 tracking-widest">BOARDING PASS</span>
                <span className="text-xs font-bold text-gray-400 tracking-widest">VIP GUEST</span>
              </div>
              
              <p className="text-xl font-display font-black text-gray-800 mb-1">{config.babyName}의 첫 생일파티</p>
              <p className="text-sm font-bold text-pink-500 mb-8">{name} 님, 환영합니다!</p>
              
              <div className="grid grid-cols-2 gap-4 text-left mb-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400">DATE</p>
                  <p className="text-sm font-bold text-gray-700">{config.date.replace(/-/g, '.')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400">TIME</p>
                  <p className="text-sm font-bold text-gray-700">{config.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-gray-400">LOCATION</p>
                  <p className="text-sm font-bold text-gray-700">{config.locationName}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center opacity-80">
                {/* Barcode mock */}
                <div className="h-10 w-full flex justify-between gap-[2px]">
                  {Array.from({length: 40}).map((_, i) => (
                    <div key={i} className="bg-gray-800 h-full" style={{ width: Math.random() > 0.5 ? '2px' : '4px', opacity: Math.random() * 0.5 + 0.5 }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-paper-deep rounded-full transform -translate-y-1/2"></div>
            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-paper-deep rounded-full transform -translate-y-1/2"></div>
          </div>
          
          <p className="text-lg font-bold text-gray-800 mb-2">참석 여부가 전달되었습니다!</p>
          <p className="text-sm text-gray-500">당일 발급된 VIP 티켓을 지참해 주세요 💛</p>
        </Reveal>
      </section>
    );

  }

  return (
    <section id="rsvp" className="py-[72px] px-6 max-w-md mx-auto">
      <Reveal>
        <SectionHeading
          eyebrow="RSVP"
          title="참석 여부 전달하기"
          description="원활한 행사 준비를 위해 참석 여부를 미리 알려주시면 감사하겠습니다."
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rsvp-name" className="block text-base font-bold mb-2">성함</label>
            <input
              id="rsvp-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="예) 홍길동"
              required
              className={FIELD}
            />
          </div>

          <fieldset>
            <legend className="block text-base font-bold mb-2">참석 여부</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" aria-pressed={isAttending} onClick={() => setIsAttending(true)} className={choiceClass(isAttending)}>참여</button>
              <button type="button" aria-pressed={!isAttending} onClick={() => setIsAttending(false)} className={choiceClass(!isAttending)}>미참여</button>
            </div>
          </fieldset>

          {isAttending && (
            <div className="space-y-3">
              <Stepper label="어른" value={adultCount} min={1} onChange={setAdultCount} />
              <Stepper label="아이" value={childCount} min={0} onChange={setChildCount} />
              {childCount > 0 && (
                <label className="flex items-center gap-3 min-h-[52px] rounded-xl border border-line px-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needBabyChair}
                    onChange={e => setNeedBabyChair(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-base font-medium">아기의자가 필요해요</span>
                </label>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full min-h-[56px] rounded-xl bg-ink text-paper text-base font-bold disabled:opacity-40"
            >
              {isSubmitting ? '전달 중...' : '제출하기'}
            </button>
          </div>
        </form>
      </Reveal>
    </section>
  );
}
