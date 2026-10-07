'use client';
import { useState, useRef } from 'react';
import YouTube from 'react-youtube';

export default function BgmPlayer({ url }: { url?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  if (!url) return null;

  // 유튜브 URL에서 ID 추출 로직
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    setIsReady(true);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div className="fixed -top-[1000px] left-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <YouTube
          videoId={videoId}
          opts={{
            playerVars: {
              autoplay: 0,
              loop: 1,
              playlist: videoId,
              controls: 0,
            },
          }}
          onReady={handleReady}
          onEnd={(e: any) => { e.target.playVideo(); }}
        />
      </div>

      {isReady && (
        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={isPlaying}
          className="fixed top-4 right-4 z-[999] min-h-[44px] px-4 rounded-full bg-paper/95 backdrop-blur border border-line text-[15px] font-medium text-ink"
        >
          {isPlaying ? '음악 끄기' : '음악 켜기'}
        </button>
      )}
    </>
  );
}
