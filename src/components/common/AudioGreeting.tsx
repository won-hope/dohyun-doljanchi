import { useState, useRef, useEffect } from 'react';

export default function AudioGreeting({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => alert('오디오 재생을 지원하지 않는 브라우저입니다.'));
    }
    setIsPlaying(!isPlaying);
  };

  if (!url) return null;

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <p className="text-sm font-bold text-gray-500 mb-3 tracking-widest uppercase">음성 감사 편지</p>
      <button 
        onClick={togglePlay}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isPlaying ? 'bg-pink-100 text-pink-600 animate-pulse' : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
        aria-label="재생/일시정지"
      >
        {isPlaying ? (
          <span className="text-2xl">⏸</span>
        ) : (
          <span className="text-2xl ml-1">▶</span>
        )}
      </button>
      <audio ref={audioRef} src={url} className="hidden" />
    </div>
  );
}
