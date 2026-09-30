import { InvitationConfig } from '@/types';
import Quiz from '@/components/common/Quiz';
import Guestbook from '@/components/common/Guestbook';
import LocationBank from '@/components/common/LocationBank';
import Gallery from '@/components/common/Gallery';
import TmiSection from '@/components/common/TmiSection';
import RsvpForm from '@/components/common/RsvpForm';
import { formatKoreanDate } from '@/utils/dateFormatter';
import { useState, useEffect } from 'react';

export default function TemplateEditorial({ config }: { config: InvitationConfig }) {
  const formattedDate = formatKoreanDate(config.date, config.time);

  const [dDayStr, setDDayStr] = useState('');
  useEffect(() => {
    if (!config.date) return;
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(config.date);
    eventDate.setHours(0,0,0,0);
    
    const diff = eventDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) setDDayStr(`D-${days}`);
    else if (days === 0) setDDayStr('D-DAY');
    else setDDayStr(`D+${Math.abs(days)}`);
  }, [config.date]);

  return (
    <div className="font-serif bg-stone-50 text-stone-900 min-h-screen pb-20" style={{ '--bg-color': '#fafaf9', '--text-color': '#1c1917' } as React.CSSProperties}>
      <header className="relative w-full h-screen flex flex-col items-center justify-end pb-24 overflow-hidden">
        {config.mainCoverImage ? (
          <img 
            src={config.mainCoverImage} 
            alt="Main" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-200" />
        )}
        
        <div className="z-10 bg-white/80 p-8 backdrop-blur-sm text-center border border-stone-200 shadow-xl m-6 max-w-[80%]">
          <h1 className="text-3xl font-bold tracking-widest mb-4">1ST BIRTHDAY</h1>
          <p className="text-lg tracking-widest mb-2">{config.babyName}의 첫돌</p>
          <p className="text-sm tracking-widest text-stone-600 mb-4">{formattedDate}</p>
          {dDayStr && (
            <div className="inline-block border border-stone-800 text-stone-800 px-4 py-1 text-sm tracking-widest font-bold">
              {dDayStr}
            </div>
          )}
        </div>
      </header>

      {/* 모시는 글 & 연락처 섹션 */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-xl font-bold mb-10 tracking-widest text-stone-800">INVITATION</h2>
        <p className="whitespace-pre-line text-sm leading-8 text-stone-600 mb-12">
          {config.greetingMessage}
        </p>
        <div className="max-w-xs mx-auto space-y-4">
          <div className="flex justify-between items-center border-b border-stone-200 pb-4">
            <span className="text-stone-700 tracking-widest text-sm">FATHER {config.fatherName}</span>
            <div className="flex gap-3">
              <a href={`tel:${config.fatherPhone}`} className="text-stone-400 hover:text-stone-800 transition">📞</a>
              <a href={`sms:${config.fatherPhone}`} className="text-stone-400 hover:text-stone-800 transition">✉️</a>
            </div>
          </div>
          <div className="flex justify-between items-center pb-2">
            <span className="text-stone-700 tracking-widest text-sm">MOTHER {config.motherName}</span>
            <div className="flex gap-3">
              <a href={`tel:${config.motherPhone}`} className="text-stone-400 hover:text-stone-800 transition">📞</a>
              <a href={`sms:${config.motherPhone}`} className="text-stone-400 hover:text-stone-800 transition">✉️</a>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-stone-50 border-t border-b border-stone-200">
        <TmiSection config={config} />
      </div>

      <div className="bg-white">
        <Gallery config={config} />
      </div>

      {/* 성장 타임라인 섹션 */}
      {config.scrollImages && config.scrollImages.length > 0 && (
        <section className="py-20 px-6 bg-stone-50 border-t border-stone-200">
          <h2 className="text-2xl font-bold text-center mb-12 tracking-widest text-stone-800">
            GROWTH STORY
          </h2>
          <div className="space-y-16">
            {config.scrollImages.map((img, idx) => (
              <div key={img.id} className={`flex flex-col items-center ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <div className="w-full aspect-[4/5] overflow-hidden mb-4 bg-stone-100 border p-2 shadow-sm">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                </div>
                <div className="text-center w-full">
                  <p className="text-stone-500 font-bold mb-1 tracking-widest">{img.month} MONTHS</p>
                  <p className="text-stone-700 font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 오시는 길 섹션 */}
      <div className="bg-stone-100 border-t border-stone-200">
        <LocationBank config={config} />
      </div>

      <div className="bg-white border-b border-stone-200">
        <RsvpForm config={config} />
      </div>

      {/* 퀴즈 이벤트 섹션 */}
      <div className="bg-stone-50 border-b border-stone-200">
        <Quiz config={config} />
      </div>

      {/* 방명록 섹션 */}
      <div className="bg-white">
        <Guestbook />
      </div>

      {/* 푸터 */}
      <footer className="py-10 text-center bg-stone-900 text-stone-400 text-xs tracking-widest">
        <p>{config.babyName}의 첫돌을 축하해 주셔서 감사합니다</p>
      </footer>
    </div>
  );
}
