'use client';

export default function FloatingTabBar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-sm bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl flex justify-around items-center py-3 px-2 text-xs font-bold text-gray-800 dark:text-white">
      <button onClick={() => scrollTo('gallery')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition">
        <span className="text-xl">🖼️</span>
        <span>사진첩</span>
      </button>
      <button onClick={() => scrollTo('location')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition">
        <span className="text-xl">📍</span>
        <span>오시는길</span>
      </button>
      <button onClick={() => scrollTo('rsvp')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition">
        <span className="text-xl">✅</span>
        <span>참석여부</span>
      </button>
      <button onClick={() => scrollTo('guestbook')} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition">
        <span className="text-xl">💌</span>
        <span>타임캡슐</span>
      </button>
    </div>
  );
}
