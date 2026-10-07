import type { Metadata, Viewport } from "next";
import { Jua, Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import "./globals.css";
import KakaoScript from "@/components/common/KakaoScript";
import { SITE_URL } from "@/lib/site";
import { getInvitationMeta } from "@/lib/invitationMeta";

// 귀여운 둥근 폰트 (파스텔 테마용)
const jua = Jua({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-jua'
});

// 본문 폰트
const notoSans = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto'
});

// 제목/날짜용 명조 (기기마다 다르게 보이던 기본 serif 대체)
const notoSerif = Noto_Serif_KR({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-serif-kr'
});

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getInvitationMeta();
  const images = meta.image ? [{ url: meta.image }] : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: SITE_URL,
      siteName: meta.title,
      images,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: meta.title,
      description: meta.description,
      images: meta.image ? [meta.image] : undefined,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} ${notoSans.variable} ${notoSerif.variable}`}>
      <body className="antialiased text-ink bg-paper-deep min-h-screen font-noto">
        <div className="max-w-md mx-auto bg-paper min-h-screen shadow-sm relative overflow-x-hidden">
          {children}
        </div>
        <KakaoScript />
      </body>
    </html>
  );
}
