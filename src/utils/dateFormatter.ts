const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// 'YYYY-MM-DD' 를 브라우저 시간대와 무관하게 해석합니다. (new Date(str)은 UTC로 해석되어 날짜가 밀릴 수 있음)
function parseLocalDate(dateStr: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function formatTimeKo(timeStr: string) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return timeStr;
  const ampm = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 || 12;
  return `${ampm} ${hour12}시${m && m !== '00' ? ` ${parseInt(m, 10)}분` : ''}`;
}

export function formatKoreanDate(dateStr: string, timeStr: string) {
  if (!dateStr) return '';
  const date = parseLocalDate(dateStr);
  if (!date) return `${dateStr} ${timeStr}`.trim();

  const dayName = DAYS_KO[date.getDay()];
  const base = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayName}요일`;
  return `${base} ${formatTimeKo(timeStr)}`.trim();
}

/** 초대장 화면에서 크게 보여줄 날짜/시간 조각 */
export function getDateParts(dateStr: string, timeStr: string) {
  const date = parseLocalDate(dateStr);
  if (!date) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    ymd: `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`,
    weekdayKo: `${DAYS_KO[date.getDay()]}요일`,
    weekdayEn: DAYS_EN[date.getDay()],
    timeKo: formatTimeKo(timeStr),
  };
}

/** 오늘 기준 D-Day 문자열 (D-24 / D-DAY / D+3) */
export function getDDay(dateStr: string) {
  const event = parseLocalDate(dateStr);
  if (!event) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((event.getTime() - today.getTime()) / 86400000);
  if (days > 0) return `D-${days}`;
  if (days === 0) return 'D-DAY';
  return `D+${Math.abs(days)}`;
}
