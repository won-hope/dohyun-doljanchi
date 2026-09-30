'use client';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import { useGuestbook } from '@/hooks/useGuestbook';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function Guestbook() {
  const { entries, loading } = useGuestbook();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      alert('타임캡슐이 안전하게 봉인되었습니다! 💌');
    } catch (error) {
      console.error(error);
      alert('등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 px-6 max-w-md mx-auto relative text-inherit">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="inline-block bg-current opacity-10 text-current text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest border border-current">
          <span className="opacity-100">TIME CAPSULE</span>
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-wide">20살의 도현이에게</h2>
        <p className="text-sm font-light opacity-80 leading-relaxed">
          먼 훗날 성인이 된 도현이가 열어볼 수 있도록<br/>따뜻한 덕담과 편지를 남겨주세요.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-md p-5 rounded-2xl shadow-xl mb-8 border border-black/5 relative">
        <div className="absolute -top-4 -right-2 text-4xl transform rotate-12">✉️</div>
        <input 
          type="text" 
          placeholder="작성자 이름" 
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={10}
          className="w-full mb-3 p-3 bg-black/5 border-transparent rounded-xl focus:border-black/20 focus:bg-black/10 focus:ring-0 text-sm outline-none transition"
        />
        <textarea 
          placeholder="20년 후의 도현이에게 어떤 말을 해주고 싶나요?" 
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          maxLength={300}
          className="w-full mb-4 p-3 bg-black/5 border-transparent rounded-xl focus:border-black/20 focus:bg-black/10 focus:ring-0 text-sm outline-none transition resize-none leading-relaxed"
        />
        <button 
          type="submit" 
          disabled={isSubmitting || !name.trim() || !message.trim()}
          className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition disabled:opacity-50"
        >
          {isSubmitting ? '봉인 중...' : '타임캡슐 봉인하기'}
        </button>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto px-2 pb-4 scrollbar-hide">
        {loading ? (
          <p className="text-center text-sm opacity-50">타임캡슐을 불러오는 중입니다...</p>
        ) : (
          entries.map((entry, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              key={entry.id} 
              className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-black/5 relative overflow-hidden group"
            >
              <div className="flex justify-between items-end mb-3">
                <span className="font-bold text-sm tracking-wide">{entry.name}</span>
                <span className="text-[10px] opacity-50">{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm opacity-90 whitespace-pre-wrap leading-relaxed font-light">{entry.message}</p>
            </motion.div>
          ))
        )}
        {entries.length === 0 && !loading && (
          <p className="text-center text-sm opacity-50 py-10">아직 봉인된 편지가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
