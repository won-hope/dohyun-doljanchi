
import { InvitationConfig } from '@/types';
import Quiz from '@/components/common/Quiz';
import Guestbook from '@/components/common/Guestbook';
import LocationBank from '@/components/common/LocationBank';
import Gallery from '@/components/common/Gallery';
import TmiSection from '@/components/common/TmiSection';
import RsvpForm from '@/components/common/RsvpForm';
import { formatKoreanDate } from '@/utils/dateFormatter';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function TemplateCinematic({ config }: { config: InvitationConfig }) {
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
    <div className="font-jua bg-emerald-50 text-emerald-900 min-h-screen overflow-x-hidden pb-20">
      
      {/* 1. 상큼발랄 커버 */}
      <header className="relative w-full h-screen flex flex-col items-center justify-start pt-12 overflow-hidden bg-gradient-to-b from-emerald-100 to-emerald-50">
        <div className="z-10 text-center flex flex-col items-center mb-8 px-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-emerald-500 font-bold tracking-widest mb-2 text-sm bg-white/80 px-4 py-1 rounded-full shadow-sm"
          >
            HAPPY 1ST BIRTHDAY
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl text-emerald-800 tracking-wide mt-4"
          >
            {config.babyName}의 첫돌
          </motion.h1>
        </div>

        {config.mainCoverImage ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-4/5 max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden border-8 border-white shadow-xl z-10 relative"
          >
            <img 
              src={config.mainCoverImage} 
              alt="Main" 
              className="w-full h-full object-cover"
            />
            {dDayStr && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-900 px-6 py-2 rounded-full font-bold shadow-md">
                {dDayStr}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="w-4/5 max-w-sm aspect-[3/4] rounded-[3rem] bg-emerald-200 border-8 border-white shadow-xl z-10" />
        )}
        
        {/* 장식용 요소들 */}
        <div className="absolute top-20 left-10 text-4xl opacity-50 animate-bounce">🎈</div>
        <div className="absolute top-40 right-10 text-4xl opacity-50 animate-pulse">✨</div>
      </header>

      {/* 2. 인사말 */}
      <section className="py-24 px-8 text-center relative bg-white">
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-emerald-50 to-white" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl text-emerald-600 mb-8">초대합니다</h2>
          <p className="whitespace-pre-line text-lg leading-loose text-gray-700 mb-12">
            {config.greetingMessage}
          </p>
          <div className="flex flex-col gap-4 text-base text-gray-600 bg-emerald-50 p-6 rounded-3xl">
            <div className="flex justify-center items-center gap-4">
              <span>아빠 <strong className="text-gray-900 text-lg">{config.fatherName}</strong></span>
              <div className="flex gap-3">
                <a href={`tel:${config.fatherPhone}`} className="bg-white p-2 rounded-full shadow-sm">📞</a>
                <a href={`sms:${config.fatherPhone}`} className="bg-white p-2 rounded-full shadow-sm">✉️</a>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 mt-2">
              <span>엄마 <strong className="text-gray-900 text-lg">{config.motherName}</strong></span>
              <div className="flex gap-3">
                <a href={`tel:${config.motherPhone}`} className="bg-white p-2 rounded-full shadow-sm">📞</a>
                <a href={`sms:${config.motherPhone}`} className="bg-white p-2 rounded-full shadow-sm">✉️</a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TMI */}
      <div className="bg-emerald-50 text-gray-900 py-10" style={{ '--bg-color': '#ecfdf5', '--text-color': '#064e3b' } as React.CSSProperties}>
        {config.useTmi !== false && <TmiSection config={config} />}
      </div>

      {/* 갤러리 */}
      <div className="bg-white text-gray-900 py-10">
        {config.useGallery !== false && <Gallery config={config} />}
      </div>

      {/* 3. 타임라인 */}
      {config.scrollImages && config.scrollImages.length > 0 && (
        <section className="py-20 bg-emerald-50">
          <h2 className="text-center text-xl text-emerald-600 mb-12">우리아기 성장일기</h2>
          <div className="flex flex-col items-center px-6">
            {config.scrollImages.map((img, idx) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-sm mb-16 bg-white p-4 rounded-3xl shadow-md relative"
              >
                <div className="absolute -top-4 -left-4 bg-yellow-300 text-yellow-900 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-md rotate-[-10deg]">
                  {img.month}개월
                </div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 mt-4">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-700 text-center text-lg">{img.caption}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 장소 안내 */}
      <div className="bg-white py-10">
        <LocationBank config={config} />
      </div>

      {/* RSVP */}
      <div className="bg-emerald-50 text-gray-900 py-10" style={{ '--bg-color': '#ecfdf5', '--text-color': '#064e3b' } as React.CSSProperties}>
        <RsvpForm config={config} />
      </div>

      {/* 5. 퀴즈 이벤트 */}
      <div className="bg-white py-10">
        {config.useQuiz !== false && <Quiz config={config} />}
      </div>

      {/* 6. 방명록 */}
      <div className="bg-emerald-50 py-10">
        <div className="text-center mb-6">
          <p className="text-emerald-500 text-sm mb-1">GUESTBOOK</p>
          <p className="text-gray-700 text-lg">도현이에게 축하 인사를 남겨주세요 💌</p>
        </div>
        {config.useGuestbook !== false && <Guestbook />}
      </div>

      <footer className="py-20 text-center bg-white text-gray-400 text-sm">
        <p>{formattedDate}</p>
        <p className="mt-2">{config.babyName}의 첫 번째 생일</p>
      </footer>
    </div>
  );
}
