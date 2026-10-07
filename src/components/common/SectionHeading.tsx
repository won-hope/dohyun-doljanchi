/** 섹션 공통 제목: 영문 라벨(작게) + 한글 제목(명조) + 선택 설명 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center mb-10">
      <p className="text-sm font-medium tracking-[0.22em] text-accent mb-3">{eyebrow}</p>
      <h2 className="font-display text-[28px] leading-snug font-semibold text-ink">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-mute">{description}</p>}
    </div>
  );
}

