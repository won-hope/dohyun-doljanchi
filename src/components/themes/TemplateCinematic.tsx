import { InvitationConfig } from '@/types';
import Quiz from '@/components/common/Quiz';
import Guestbook from '@/components/common/Guestbook';
import LocationBank from '@/components/common/LocationBank';
import Gallery from '@/components/common/Gallery';
import TmiSection from '@/components/common/TmiSection';
import RsvpForm from '@/components/common/RsvpForm';
import { formatKoreanDate } from '@/utils/dateFormatter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function TemplateCinematic({ config }: { config: InvitationConfig }) {
  const formattedDate = formatKoreanDate(config.date, config.time);
  
  // D-Day 계산기
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
    <div className="font-serif bg-black text-white min-h-screen overflow-x-hidden selection:bg-white/30 pb-20">
      
      {/* 1. 시네마틱 풀스크린 커버 */}
      <header className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {config.mainCoverImage ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            src={config.mainCoverImage} 
            alt="Main" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />

        <div className="relative z-10 text-center flex flex-col items-center mt-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gold-400 font-bold tracking-[0.3em] mb-4 text-sm"
          >
            FIRST BIRTHDAY
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-5xl md:text-6xl font-light tracking-widest mb-6"
          >
            {config.babyName}
          </motion.h1>
          {dDayStr && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1, type: "spring" }}
              className="text-2xl font-bold bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {dDayStr}
            </motion.div>
          )}
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest flex flex-col items-center"
        >
          <span className="mb-2">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </header>

      {/* 2. 감성 모시는 글 */}
      <section className="py-32 px-8 text-center bg-zinc-950 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-sm font-bold tracking-[0.3em] text-zinc-500 mb-10">INVITATION</h2>
          <p className="whitespace-pre-line text-lg leading-[2.5] text-zinc-300 font-light mb-16">
            {config.greetingMessage}
          </p>
          <div className="flex flex-col gap-6 text-sm tracking-widest text-zinc-400">
            <div className="flex justify-center items-center gap-4">
              <span>FATHER <strong className="text-white ml-2">{config.fatherName}</strong></span>
              <div className="flex gap-2">
                <a href={`tel:${config.fatherPhone}`} className="text-zinc-500 hover:text-white transition">📞</a>
                <a href={`sms:${config.fatherPhone}`} className="text-zinc-500 hover:text-white transition">✉️</a>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4">
              <span>MOTHER <strong className="text-white ml-2">{config.motherName}</strong></span>
              <div className="flex gap-2">
                <a href={`tel:${config.motherPhone}`} className="text-zinc-500 hover:text-white transition">📞</a>
                <a href={`sms:${config.motherPhone}`} className="text-zinc-500 hover:text-white transition">✉️</a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TMI */}
      <div className="bg-black text-white" style={{ '--bg-color': '#fff', '--text-color': '#000' } as React.CSSProperties}>
        <TmiSection config={config} />
      </div>

      {/* 갤러리 */}
      <div className="bg-zinc-950 text-white">
        <Gallery config={config} />
      </div>

      {/* 3. 시네마틱 타임라인 */}
      {config.scrollImages && config.scrollImages.length > 0 && (
        <section className="py-20 bg-black">
          <h2 className="text-center text-sm font-bold tracking-[0.3em] text-zinc-500 mb-20">GROWTH STORY</h2>
          <div className="flex flex-col items-center">
            {config.scrollImages.map((img, idx) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-sm mb-24 relative"
              >
                <div className="w-full aspect-[4/5] bg-zinc-900 overflow-hidden relative group">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                </div>
                <div className="absolute -left-4 -bottom-6 bg-black px-4 py-2 border border-zinc-800 backdrop-blur-md z-10">
                  <p className="text-3xl font-light italic">{img.month}<span className="text-sm not-italic text-zinc-500 ml-1">MONTHS</span></p>
                </div>
                <div className="mt-6 px-4 text-right">
                  <p className="text-zinc-400 font-light tracking-wider">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 장소 안내 */}
      <div className="bg-zinc-950 py-10 [&_h2]:text-zinc-300 [&_p]:text-zinc-400 [&_.bg-white]:bg-zinc-900 [&_.bg-white]:border-zinc-800 [&_.bg-white]:text-zinc-300 [&_span]:text-zinc-300">
        <LocationBank config={config} />
      </div>

      {/* RSVP */}
      <div className="bg-black text-white" style={{ '--bg-color': '#fff', '--text-color': '#000' } as React.CSSProperties}>
        <RsvpForm config={config} />
      </div>

      {/* 5. 퀴즈 이벤트 */}
      <div className="bg-zinc-950 py-10 [&_h2]:text-white [&_.bg-white]:bg-zinc-900 [&_.bg-white]:border-zinc-800 [&_.bg-white]:text-white [&_input]:bg-zinc-800 [&_input]:text-white [&_textarea]:bg-zinc-800 [&_textarea]:text-white [&_button.bg-gray-800]:bg-white [&_button.bg-gray-800]:text-black">
        <Quiz config={config} />
      </div>

      {/* 6. 방명록 (타임캡슐 컨셉) */}
      <div className="bg-black py-10 [&_h2]:text-zinc-300 [&_.bg-white]:bg-zinc-900 [&_.bg-white]:border-zinc-800 [&_.bg-white]:text-white [&_input]:bg-zinc-800 [&_input]:text-white [&_textarea]:bg-zinc-800 [&_textarea]:text-white [&_button.bg-gray-800]:bg-white [&_button.bg-gray-800]:text-black">
        <div className="text-center mb-6">
          <p className="text-zinc-500 text-xs tracking-widest mb-2">TIME CAPSULE</p>
          <p className="text-zinc-300 font-light text-sm">20살이 될 도현이에게 남기는 편지 ✉️</p>
        </div>
        <Guestbook />
      </div>

      <footer className="py-20 text-center bg-zinc-950 text-zinc-600 text-xs tracking-[0.2em]">
        <p>{formattedDate}</p>
        <p className="mt-2">{config.babyName}의 첫 번째 생일</p>
      </footer>
    </div>
  );
}
