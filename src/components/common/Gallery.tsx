'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InvitationConfig, GalleryImage } from '@/types';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

// 사진 1장(크게) → 2장(나란히) 을 반복하는 에디토리얼 레이아웃. 마지막에 남는 1장은 크게 보여줍니다.
function groupPhotos(images: GalleryImage[]) {
  const groups: GalleryImage[][] = [];
  let i = 0;
  let single = true;
  while (i < images.length) {
    const size = single || i === images.length - 1 ? 1 : 2;
    groups.push(images.slice(i, i + size));
    i += size;
    single = !single;
  }
  return groups;
}

export default function Gallery({ config }: { config: InvitationConfig }) {
  const [selected, setSelected] = useState<string | null>(null);
  const images = config.galleryImages ?? [];

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  if (images.length === 0) return null;

  let photoNo = 0;

  return (
    <section id="gallery" className="py-[72px] px-5">
      <Reveal>
        <SectionHeading eyebrow="GALLERY" title="사진첩" description={`${config.babyName}의 소중한 순간들`} />
      </Reveal>

      <div className="max-w-md mx-auto space-y-3">
        {groupPhotos(images).map((group, gi) => (
          <Reveal key={gi}>
            <div className={group.length === 2 ? 'grid grid-cols-2 gap-3' : ''}>
              {group.map((img) => {
                photoNo += 1;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelected(img.url)}
                    aria-label={`사진 ${photoNo} 크게 보기`}
                    className={`block w-full overflow-hidden bg-paper-deep ${group.length === 2 ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}
                  >
                    <img
                      src={img.url}
                      alt={`${config.babyName} 사진 ${photoNo}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: '50% 30%' }}
                    />
                  </button>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="사진 크게 보기"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[9999] bg-paper/95 flex items-center justify-center p-4"
          >
            <img src={selected} alt="" className="max-w-full max-h-full object-contain" />
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-ink text-paper text-2xl leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
