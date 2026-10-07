import { InvitationConfig } from '@/types';
import Guestbook from '@/components/common/Guestbook';
import LocationBank from '@/components/common/LocationBank';
import Quiz from '@/components/common/Quiz';
import QuizWinnerAnnounce from '@/components/common/QuizWinnerAnnounce';
import Gallery from '@/components/common/Gallery';
import TmiSection from '@/components/common/TmiSection';
import RsvpForm from '@/components/common/RsvpForm';
import { motion } from 'framer-motion';
import { formatKoreanDate } from '@/utils/dateFormatter';
import { useState, useEffect } from 'react';

export default function TemplatePolaroid({ config }: { config: InvitationConfig }) {
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
    <div className="font-jua bg-baby-yellow text-gray-800 min-min-h-[85vh] pb-12 overflow-x-hidden pb-20" style={{ '--bg-color': '#fde68a', '--text-color': '#9333ea' } as React.CSSProperties}>
      
      {/* 커버 섹션 */}
      <header className="px-6 pt-20 pb-10 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-4 text-4xl opacity-50 animate-bounce">🎈</div>
        <div className="absolute top-20 right-6 text-3xl opacity-50 animate-pulse">✨</div>

        <div className="bg-white p-4 pb-14 shadow-2xl rotate-[-4deg] hover:rotate-[2deg] transition-transform duration-500 rounded-2xl mb-8 w-full max-w-[320px] relative z-10 border-4 border-white">
          <div className="absolute -top-4 -left-4 text-4xl transform -rotate-12">🎀</div>
          
          {dDayStr && (
            <div className="absolute -top-5 -right-3 bg-red-500 text-white font-sans font-bold text-lg px-4 py-2 rounded-full shadow-lg transform rotate-6 border-2 border-white z-20">
              {dDayStr}
            </div>
          )}

          {config.mainCoverImage ? (
            <img src={config.mainCoverImage} alt="Main" className="w-full aspect-[4/5] object-cover mb-4 rounded-xl" />
          ) : (
            <div className="w-full aspect-[4/5] bg-baby-blue mb-4 rounded-xl flex items-center justify-center text-gray-400">사진을 등록해주세요</div>
          )}
          <p className="text-center text-3xl text-pink-500 tracking-wider">{config.babyName}의 첫돌 🎂</p>
        </div>
        
        <div className="bg-white/80 px-8 py-4 rounded-full shadow-md border-2 border-pink-200 z-10 relative text-center">
          <p className="text-xl text-gray-700 tracking-wide mb-1">사랑스러운 파티에 초대해요!</p>
          <p className="text-lg text-pink-600 font-bold">{formattedDate}</p>
        </div>
      </header>

      {/* 인사말 섹션 */}
      <section className="py-10 px-6 text-center relative z-10 bg-white/50 m-4 rounded-3xl shadow-sm border border-white">
        <h2 className="text-2xl text-pink-500 mb-6 font-bold">초대하는 글</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 mb-8 font-sans font-medium">
          {config.greetingMessage}
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-inner space-y-4 font-sans text-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-gray-500 font-bold">아빠 <span className="text-gray-800 text-lg ml-2">{config.fatherName}</span></span>
            <div className="flex gap-3 text-xl">
              <a href={`tel:${config.fatherPhone}`} className="hover:scale-110 transition bg-baby-blue p-2 rounded-full shadow-sm">📞</a>
              <a href={`sms:${config.fatherPhone}`} className="hover:scale-110 transition bg-baby-green p-2 rounded-full shadow-sm">✉️</a>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-500 font-bold">엄마 <span className="text-gray-800 text-lg ml-2">{config.motherName}</span></span>
            <div className="flex gap-3 text-xl">
              <a href={`tel:${config.motherPhone}`} className="hover:scale-110 transition bg-baby-pink p-2 rounded-full shadow-sm">📞</a>
              <a href={`sms:${config.motherPhone}`} className="hover:scale-110 transition bg-baby-yellow p-2 rounded-full shadow-sm">✉️</a>
            </div>
          </div>
        </div>
      </section>

      <div className="text-pink-600">
        {config.useTmi !== false && <TmiSection config={config} />}
      </div>

      <div className="bg-white/40">
        {config.useGallery !== false && <Gallery config={config} />}
      </div>

      {config.scrollImages && config.scrollImages.length > 0 && (
        <section className="py-10 bg-baby-blue/20">
          <h2 className="text-3xl text-center text-blue-500 mb-8 font-bold">도현이의 1년 🐣</h2>
          <div className="flex flex-col items-center">
            {config.scrollImages.map((img, idx) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, y: 50, rotate: idx % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: idx % 2 === 0 ? -2 : 2 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="w-full max-w-[280px] mb-10 relative"
              >
                <div className="bg-white p-3 pb-12 shadow-xl rounded-xl border border-gray-100">
                  <img src={img.url} alt={img.caption} className="w-full aspect-square object-cover rounded-lg mb-4" />
                  <p className="text-center text-gray-700 text-lg">{img.caption}</p>
                </div>
                <div className={`absolute -top-6 ${idx % 2 === 0 ? '-left-6' : '-right-6'} bg-yellow-400 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg transform rotate-12 border-4 border-white`}>
                  {img.month}M
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {config.eventMode !== 'THANK_YOU' && <LocationBank config={config} />}
      
      {config.useRsvp !== false && config.eventMode !== 'THANK_YOU' && (
      <div className="bg-white/40">
        <RsvpForm config={config} />
      </div>
      )}

      {config.useQuiz !== false && config.eventMode !== 'THANK_YOU' && (
      <div className="bg-baby-pink/30 [&_.bg-white]:bg-white/80">
        <Quiz config={config} />
      </div>
      )}
      
      {config.useGuestbook !== false && config.eventMode !== 'THANK_YOU' && (
      <div className="bg-white/50 text-gray-800">
        <Guestbook />
      </div>
      )}

            {config.eventMode === 'THANK_YOU' && <QuizWinnerAnnounce />}
      {config.eventMode !== 'THANK_YOU' && (
      <footer className="py-12 text-center text-gray-400 text-sm">
        <p>{formattedDate}</p>
        <p className="mt-2 text-xl text-pink-400">{config.babyName} 생일파티 🥳</p>
      </footer>
      )}
    </div>
  );
}
