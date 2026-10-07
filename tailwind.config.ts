import type { Config } from "tailwindcss";

// 컬러는 globals.css 의 CSS 변수(rgb 채널)를 사용합니다. (bg-ink/60 같은 투명도 표기 지원)
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jua: ['var(--font-jua)', 'sans-serif'],
        noto: ['var(--font-noto)', 'sans-serif'],
        display: ['var(--font-serif-kr)', 'serif'],
      },
      colors: {
        paper: token('paper'),
        'paper-deep': token('paper-deep'),
        ink: token('ink'),
        mute: token('mute'),
        line: token('line'),
        accent: token('accent'),
        baby: {
          blue: '#E0F2FE',
          pink: '#FCE7F3',
          yellow: '#FEF9C3',
          green: '#DCFCE7',
          purple: '#F3E8FF'
        }
      }
    },
  },
  plugins: [],
};
export default config;
