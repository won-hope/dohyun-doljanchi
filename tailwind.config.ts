import type { Config } from "tailwindcss";

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
      },
      colors: {
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
