'use client';
import { useDoljabi } from '@/hooks/useDoljabi';
import { motion } from 'framer-motion';

const ITEMS = [
  { id: 'money', label: '돈', icon: '💰', desc: '부자가 될 거예요' },
  { id: 'stethoscope', label: '청진기', icon: '🩺', desc: '건강하게 자랄게요' },
  { id: 'gavel', label: '판사봉', icon: '⚖️', desc: '훌륭한 사람이 될게요' },
  { id: 'yarn', label: '명주실', icon: '🧶', desc: '오래오래 건강할게요' },
  { id: 'microphone', label: '마이크', icon: '🎤', desc: '다재다능한 아이로' },
  { id: 'pencil', label: '연필', icon: '✏️', desc: '지혜로운 아이로' },
];

export default function Doljabi() {
  const { votes, hasVoted, castVote, loading } = useDoljabi();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <section className="py-20 px-6 max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-bold mb-3 tracking-wide">DOLJABI EVENT</h2>
        <p className="text-sm text-gray-600">도현이가 무엇을 잡을까요?<br/>정답을 맞혀주신 분들께 추첨을 통해 선물을 드립니다.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {ITEMS.map((item, idx) => {
          const count = votes[item.id] || 0;
          const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              disabled={hasVoted}
              onClick={() => castVote(item.id)}
              className={`relative overflow-hidden rounded-xl p-4 border-2 flex flex-col items-center justify-center transition-all ${hasVoted ? 'bg-gray-50 border-gray-200 cursor-default' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm hover:shadow-md active:scale-95'}`}
            >
              <span className="text-4xl mb-2">{item.icon}</span>
              <span className="font-bold text-gray-800">{item.label}</span>
              <span className="text-[10px] text-gray-500 mt-1 text-center leading-tight">{item.desc}</span>
              
              {hasVoted && (
                <div className="absolute bottom-0 left-0 h-1 bg-blue-400 transition-all duration-1000" style={{ width: `${percentage}%` }} />
              )}
              {hasVoted && (
                <div className="absolute top-2 right-2 text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full z-10">
                  {percentage}%
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      {hasVoted && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center mt-8 text-sm font-bold text-blue-600 bg-blue-50 py-3 rounded-full"
        >
          투표가 완료되었습니다! 감사합니다. 🎉
        </motion.p>
      )}
    </section>
  );
}
