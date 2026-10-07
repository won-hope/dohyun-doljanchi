'use client';
import { InvitationConfig } from '@/types';
import { SITE_URL } from '@/lib/site';
import { formatKoreanDate } from '@/utils/dateFormatter';

export default function ShareButton({ config }: { config: InvitationConfig }) {
  const handleKakaoShare = () => {
    const kakao = typeof window !== 'undefined' ? (window as any).Kakao : undefined;
    if (!kakao) {
      alert('카카오톡 공유 기능을 지원하지 않는 환경입니다.');
      return;
    }
    if (!kakao.isInitialized()) {
      alert('카카오톡 공유가 초기화되지 않았습니다. (API KEY 필요)');
      return;
    }

    // localhost 에서 눌러도 항상 실제 배포 주소가 전달되도록 고정 URL 사용
    const link = { mobileWebUrl: SITE_URL, webUrl: SITE_URL };

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${config.babyName}의 첫돌에 초대합니다!`,
        description: `${formatKoreanDate(config.date, config.time)}\n${config.locationName}`,
        imageUrl: config.mainCoverImage || 'https://cdn-icons-png.flaticon.com/512/3855/3855907.png',
        link,
      },
      buttons: [{ title: '초대장 보기', link }],
    });
  };

  return (
    <button
      type="button"
      onClick={handleKakaoShare}
      className="w-full min-h-[56px] rounded-xl bg-[#FEE500] text-[#191919] text-base font-bold transition-colors hover:bg-[#F4DC00] active:bg-[#EAD300]"
    >
      카카오톡으로 초대장 공유하기
    </button>
  );
}
