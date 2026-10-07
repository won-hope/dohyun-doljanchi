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
          <div className="p-8 rounded-2xl bg-paper-deep border border-line">
            <p className="text-xl font-display font-bold mb-2">감사합니다!</p>
            <p className="text-mute">참석 여부가 소중히 전달되었습니다.</p>
          </div>
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
