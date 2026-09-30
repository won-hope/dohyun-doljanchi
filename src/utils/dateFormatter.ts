export function formatKoreanDate(dateStr: string, timeStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return `${dateStr} ${timeStr}`;

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = days[date.getDay()];
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let timeFormatted = timeStr;
  if (timeStr) {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour < 12 ? '오전' : '오후';
    const hour12 = hour % 12 || 12;
    timeFormatted = `${ampm} ${hour12}시 ${m === '00' ? '' : m + '분'}`;
  }

  return `${year}년 ${month}월 ${day}일 ${dayName}요일 ${timeFormatted}`.trim();
}
