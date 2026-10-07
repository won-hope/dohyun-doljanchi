'use client';
import { useEffect, useState } from 'react';

const TABS = [
  { id: 'gallery', label: '사진첩' },
  { id: 'location', label: '오시는 길' },
  { id: 'rsvp', label: '참석 여부' },
  { id: 'guestbook', label: '방명록' },
];

export default function FloatingTabBar() {
  // 화면에 실제로 존재하는 섹션만 보여줍니다. (사진이 없으면 '사진첩' 탭도 없음)
  const [available, setAvailable] = useState<string[]>([]);

  useEffect(() => {
    setAvailable(TABS.map(t => t.id).filter(id => document.getElementById(id)));
  }, []);

  const scrollTo = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  const tabs = TABS.filter(t => available.includes(t.id));
  if (tabs.length === 0) return null;

  return (
    <nav
      aria-label="바로가기"
      className="fixed left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-32px)] max-w-sm bg-paper/95 backdrop-blur border border-line rounded-full flex items-center justify-around px-2"
      style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => scrollTo(tab.id)}
          className="flex-1 min-h-[48px] px-1 text-[15px] font-medium text-ink hover:text-accent"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
