import type { Metadata } from "next";
import { Jua, Noto_Sans_KR } from 'next/font/google';
import "./globals.css";
import KakaoScript from "@/components/common/KakaoScript";

// 귀여운 둥근 폰트 (메인)
const jua = Jua({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-jua'
});

// 깔끔한 기본 폰트 (에디토리얼용 등)
const notoSans = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto'
});


export const metadata: Metadata = {
  title: "도현이의 첫돌에 초대합니다",
  description: "우리아기 첫번째 생일파티에 함께해주세요!",
  openGraph: {
    title: "도현이의 첫돌에 초대합니다",
    description: "우리아기 첫번째 생일파티에 함께해주세요!",
    url: "https://dohyun-first-birthday.web.app",
    siteName: "도현이 첫돌 초대장",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
        width: 800,
        height: 600,
      }
    ],
    locale: "ko_KR",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} ${notoSans.variable}`}>
      <body className="antialiased text-gray-900 bg-gray-100 min-h-screen font-noto">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-md relative overflow-x-hidden">
          {children}
        </div>
        <KakaoScript />
      </body>
    </html>
  );
}
