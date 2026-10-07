'use client';
import { useState } from 'react';
import { InvitationConfig } from '@/types';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import ShareButton from './ShareButton';

const MAP_BUTTON =
  'flex items-center justify-center min-h-[52px] rounded-xl border border-line bg-paper text-base font-medium text-ink transition-colors hover:bg-paper-deep active:bg-paper-deep';

export default function LocationBank({
  config,
  showShare = true,
}: {
  config: InvitationConfig;
  /** 공유 버튼을 다른 곳(마무리 섹션)에 둘 때 false */
  showShare?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const address = config.locationAddress || '강원도 원주시';
  const locationName = config.locationName || '고궁한정식';
  // 시/도 + 시/군 까지만 앞에 붙여 검색 정확도를 높입니다.
  const mapSearchQuery = encodeURIComponent(`${address.split(' ').slice(0, 2).join(' ')} ${locationName}`);

  const mapLinks = {
    naver: `https://m.map.naver.com/search2/search.naver?query=${mapSearchQuery}`,
    kakao: `https://map.kakao.com/link/search/${mapSearchQuery}`,
    tmap: `tmap://search?name=${mapSearchQuery}`,
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`주소: ${address}`);
    }
  };

  return (
    <section id="location" className="py-[72px] px-6 max-w-md mx-auto">
      <Reveal>
        <SectionHeading eyebrow="LOCATION" title="오시는 길" />

        <div className="text-center mb-8">
          <p className="font-display text-2xl font-semibold text-ink mb-3">{config.locationName}</p>
          <p className="text-lg leading-relaxed text-ink">{config.locationAddress}</p>
          {config.locationAddressDetail && (
            <p className="mt-1 text-base text-mute">{config.locationAddressDetail}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <a href={mapLinks.naver} target="_blank" rel="noopener noreferrer" className={MAP_BUTTON}>
            네이버지도
          </a>
          <a href={mapLinks.kakao} target="_blank" rel="noopener noreferrer" className={MAP_BUTTON}>
            카카오맵
          </a>
          <a href={mapLinks.tmap} className={MAP_BUTTON}>
            티맵
          </a>
        </div>
        <button type="button" onClick={copyAddress} className={`${MAP_BUTTON} w-full`} aria-live="polite">
          {copied ? '주소가 복사되었습니다' : '주소 복사하기'}
        </button>

        {config.parkingInfo?.trim() && (
          <div id="parking" className="mt-12 pt-10 border-t border-line text-center">
            <p className="text-sm font-medium tracking-[0.22em] text-accent mb-3">PARKING</p>
            <h3 className="font-display text-2xl font-semibold text-ink mb-4">주차 안내</h3>
            <p className="whitespace-pre-line text-[17px] leading-[1.9] text-ink">{config.parkingInfo}</p>
          </div>
        )}

        {showShare && (
          <div className="mt-12">
            <ShareButton config={config} />
          </div>
        )}
      </Reveal>
    </section>
  );
}
