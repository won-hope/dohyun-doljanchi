/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages 저장소 이름과 동일하게 설정해야 CSS/JS 파일이 정상 로드됩니다.
  // 로컬 개발 환경(npm run dev)에서는 http://localhost:3000/dohyun-doljanchi 로 접속해야 합니다.
  basePath: process.env.NODE_ENV === 'production' ? '/dohyun-doljanchi' : '',
};

module.exports = nextConfig;
