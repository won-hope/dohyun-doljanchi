'use client';
import Script from 'next/script';

export default function KakaoScript() {
  const kakaoInit = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      const kakao = (window as any).Kakao;
      if (!kakao.isInitialized()) {
        const apiKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
        if (apiKey) {
          kakao.init(apiKey);
        } else {
          console.error("Kakao API Key is missing");
        }
      }
    }
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="lazyOnload"
      onLoad={kakaoInit}
    />
  );
}
