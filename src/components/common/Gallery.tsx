'use client';
import { InvitationConfig, GalleryImage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Gallery({ config }: { config: InvitationConfig }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!config.galleryImages || config.galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="py-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">GALLERY</h2>
        <p className="text-sm opacity-60">도현이의 소중한 순간들</p>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-2 max-w-md mx-auto">
        {config.galleryImages.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="aspect-square cursor-pointer overflow-hidden rounded-sm"
            onClick={() => setSelectedImg(img.url)}
          >
            <img src={img.url} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition duration-500" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImg} 
              alt="Enlarged" 
              className="max-w-full max-h-full object-contain rounded-md"
            />
            <button className="absolute top-6 right-6 text-white text-3xl font-light hover:scale-110 transition">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
