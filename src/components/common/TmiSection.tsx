'use client';
import { InvitationConfig } from '@/types';
import { motion } from 'framer-motion';

export default function TmiSection({ config }: { config: InvitationConfig }) {
  if (!config.tmiItems || config.tmiItems.length === 0) return null;

  return (
    <section id="tmi" className="py-16 px-6 max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">도현이의 TMI 🎤</h2>
        <p className="text-sm opacity-60">우리가 몰랐던 도현이의 쪼꼬미 비밀들</p>
      </div>
      
      <div className="space-y-4">
        {config.tmiItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-current/5 border border-current/10 p-5 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-current/5 rounded-bl-full -z-10"></div>
            <h3 className="font-bold text-sm mb-2 opacity-90 flex items-start gap-2">
              <span className="text-pink-500 font-black">Q.</span> 
              <span>{item.question}</span>
            </h3>
            <p className="text-sm opacity-80 leading-relaxed flex items-start gap-2">
              <span className="text-blue-500 font-black">A.</span> 
              <span>{item.answer}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
