'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/** 스크롤 시 은은하게 나타나는 효과 (fade + 12px). reduced-motion 은 MotionConfig 에서 처리 */
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

