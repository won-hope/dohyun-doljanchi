'use client';
import { InvitationConfig } from '@/types';
import { motion } from 'framer-motion';

export default function LocationBank({ config }: { config: InvitationConfig }) {
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      const kakao = (window as any).Kakao;
      if (!kakao.isInitialized()) {
        alert('카카오톡 공유가 초기화되지 않았습니다. (API KEY 필요)');
        return;
      }
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${config.babyName}의 첫돌에 초대합니다!`,
          description: `일시: ${config.date} ${config.time}\n장소: ${config.locationName}`,
          imageUrl: config.mainCoverImage || 'https://cdn-icons-png.flaticon.com/512/3855/3855907.png',
          link: {
            mobileWebUrl: 'https://won-hope.github.io/dohyun-doljanchi/',
            webUrl: 'https://won-hope.github.io/dohyun-doljanchi/',
          },
        },
        buttons: [
          {
            title: '초대장 보기',
            link: {
              mobileWebUrl: 'https://won-hope.github.io/dohyun-doljanchi/',
              webUrl: 'https://won-hope.github.io/dohyun-doljanchi/',
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유 기능을 지원하지 않는 환경입니다.');
    }
  };

  const address = config.locationAddress || '강원도 원주시';
  const locationName = config.locationName || '고궁한정식';
  const mapSearchQuery = encodeURIComponent(`${address.split(' ')[0]} ${locationName}`);

  const mapLinks = {
    naver: `https://m.map.naver.com/search2/search.naver?query=${mapSearchQuery}`,
    kakao: `https://map.kakao.com/link/search/${mapSearchQuery}`,
    tmap: `tmap://search?name=${mapSearchQuery}`
  };

  return (
    <section id="location" className="py-20 px-6 max-w-md mx-auto">
      {/* 오시는 길 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-bold mb-3 tracking-wide text-gray-800">LOCATION</h2>
        <p className="text-xl font-bold text-gray-800 mb-2">{config.locationName}</p>
        <p className="text-sm text-gray-600 mb-1">{config.locationAddress}</p>
        {config.locationAddressDetail && <p className="text-xs text-gray-500 mb-8">{config.locationAddressDetail}</p>}

        {/* 길찾기 버튼들 */}
        <div className="flex justify-center gap-3 mb-10">
          <a
            href={mapLinks.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#03C75A] text-white py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition text-sm flex flex-col items-center justify-center gap-1"
          >
            네이버지도
          </a>
          <a
            href={mapLinks.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition text-sm flex flex-col items-center justify-center gap-1"
          >
            카카오맵
          </a>
          <a
            href={mapLinks.tmap}
            className="flex-1 bg-[#000000] text-white py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition text-sm flex flex-col items-center justify-center gap-1"
          >
            티맵
          </a>
        </div>
      </motion.div>

      {/* 공유하기 버튼 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <button
          onClick={handleKakaoShare}
          className="w-full bg-[#FEE500] text-[#191919] font-bold py-4 rounded-2xl shadow-sm hover:bg-[#F4DC00] transition flex justify-center items-center gap-2"
        >
          카카오톡으로 초대장 공유하기
        </button>
      </motion.div>
    </section>
  );
}
