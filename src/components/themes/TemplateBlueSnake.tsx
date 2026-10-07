import AudioGreeting from "@/components/common/AudioGreeting";
import { InvitationConfig } from '@/types';
import Quiz from '@/components/common/Quiz';
import QuizWinnerAnnounce from '@/components/common/QuizWinnerAnnounce';
import Guestbook from '@/components/common/Guestbook';
import LocationBank from '@/components/common/LocationBank';
import Gallery from '@/components/common/Gallery';
import TmiSection from '@/components/common/TmiSection';
import RsvpForm from '@/components/common/RsvpForm';
import ShareButton from '@/components/common/ShareButton';
import Reveal from '@/components/common/Reveal';
import SectionHeading from '@/components/common/SectionHeading';
import { formatKoreanDate, getDDay, getDateParts } from '@/utils/dateFormatter';

function ContactRow({ role, name, phone }: { role: string; name: string; phone: string }) {
  const btn =
    'inline-flex items-center justify-center min-h-[44px] min-w-[64px] px-4 rounded-full border border-line text-[15px] font-medium text-ink hover:bg-paper-deep transition-colors';
  return (
    <li className="flex items-center justify-between gap-4 py-5">
      <div>
        <p className="text-sm text-mute">{role}</p>
        <p className="font-display text-xl font-semibold">{name}</p>
      </div>
      {phone && (
        <div className="flex gap-2">
          <a href={`tel:${phone}`} className={btn} aria-label={`${role} ${name}에게 전화하기`}>
            전화
          </a>
          <a href={`sms:${phone}`} className={btn} aria-label={`${role} ${name}에게 문자 보내기`}>
            문자
          </a>
        </div>
      )}
    </li>
  );
}

/**
 * 푸른 뱀(청사 靑巳)과 한국 전통 매듭의 우아한 곡선미를 형상화한 미니멀 엠블럼 SVG
 */
function BlueSnakeEmblem({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      {/* 부드러운 뫼비우스 곡선 & 지혜의 청사 라인 */}
      <path
        d="M24 10C17.5 10 14 15 14 20C14 27 34 23 34 30C34 35.5 29.5 38 24 38C18.5 38 14.5 34.5 14.5 31"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 맑은 기운을 품은 옥빛 눈/보석 포인트 */}
      <circle cx="24" cy="10" r="2" fill="currentColor" />
      {/* 은은한 전통 매듭 장식 포인트 */}
      <circle cx="24" cy="24" r="1.5" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

export default function TemplateBlueSnake({ config }: { config: InvitationConfig }) {
  const parts = getDateParts(config.date, config.time);
  const dDay = getDDay(config.date);
  const story = [...(config.scrollImages ?? [])].sort((a, b) => a.month - b.month);

  return (
    <div
      className="theme-blue-snake min-h-screen bg-paper text-ink pb-24 selection:bg-accent/20"
      style={
        {
          /* 맑은 옥빛 백자 한지와 단아한 쪽빛 잉크 팔레트 (RGB 채널) */
          '--paper': '246 250 249', // #F6FAF9 맑고 투명한 옥빛 백자 한지 바탕
          '--paper-deep': '235 244 242', // #EBF4F2 한 톤 깊은 옥비취빛
          '--ink': '26 43 51', // #1A2B33 깊고 기품 있는 쪽빛 청먹
          '--mute': '84 105 113', // #546971 은은한 청회색
          '--line': '208 223 220', // #D0DFDC 맑은 옥빛 라인
          '--accent': '36 105 115', // #246973 청명한 청사(Blue Snake) 액센트
        } as React.CSSProperties
      }
    >
      {/* 01. COVER — 푸른 뱀띠 (을사년 乙巳年) 에디토리얼 헤더 */}
      <header>
        {/* 상단 테마 헤더 바 */}
        <div className="pt-10 pb-4 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-line bg-paper-deep text-accent text-xs font-medium tracking-[0.2em]">
            <BlueSnakeEmblem className="w-4 h-4 text-accent" />
            <span>乙巳年 靑巳 · 푸른 뱀의 해</span>
          </div>
        </div>

        {/* 대표 사진 — 은은한 옥빛 프레임과 함께 사진 자체를 독립적으로 보여줌 */}
        <div className="px-6 max-w-md mx-auto">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl border-2 border-line/80 shadow-sm bg-paper-deep flex justify-center items-center">
            {config.mainCoverImage ? (
              <img
                src={config.mainCoverImage}
                alt={`${config.babyName}의 첫돌 사진`}
                decoding="async"
                className="w-full h-full object-contain p-2"
                style={{ objectPosition: `50% ${config.coverFocusY ?? 30}%` }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-mute text-sm">
                사진을 등록해 주세요
              </div>
            )}
          </div>
        </div>

        {/* 사진 하단 텍스트 정보 — 사진 위에 글씨가 겹치지 않도록 분리 */}
        <div className="px-6 pt-10 pb-[72px] text-center max-w-md mx-auto">
          <p className="text-xs font-semibold tracking-[0.35em] text-accent uppercase">
            The Year of Blue Snake · First Birthday
          </p>

          {config.eventMode === 'THANK_YOU' ? (
            <>
              <h1 className="mt-4 font-display text-[32px] leading-tight font-semibold tracking-tight text-ink">
                함께해 주셔서<br/>감사합니다
              </h1>
              <div className="mt-8 mb-8 text-[15px] text-ink/85 font-medium leading-[2.2] bg-[#EBF4F2]/50 p-7 rounded-2xl border border-[#D0DFDC]/50 shadow-sm">
                무사히 첫 생일 파티를 마쳤습니다.<br/>
                바쁘신 와중에도 {config.babyName}의 첫걸음을<br/>
                축복해 주셔서 진심으로 감사드립니다.<br/><br/>
                베풀어주신 따뜻한 마음 간직하며,<br/>
                건강하고 지혜로운 아이로 잘 키우겠습니다.
              </div>
              <AudioGreeting url={config.audioGreetingUrl || ''} />
            </>
          ) : (
            <>
              <h1 className="mt-4 font-display text-[36px] leading-tight font-semibold tracking-tight">
                {config.babyName}의 첫돌
              </h1>
              <p className="mt-2 text-base text-mute font-medium">
                푸른 뱀의 맑은 지혜와 온화함을 품은 첫 번째 생일
              </p>
            </>
          )}

          {config.eventMode !== 'THANK_YOU' && (
          <div className="mt-8 pt-6 border-t border-line/60">
            {parts ? (
              <>
                <p className="font-display text-[26px] tracking-wide text-ink">
                  {parts.ymd}{' '}
                  <span className="text-base tracking-[0.18em] text-accent font-sans font-medium">
                    {parts.weekdayEn}
                  </span>
                </p>
                <p className="mt-1.5 text-lg font-medium text-mute">
                  {parts.weekdayKo} {parts.timeKo}
                </p>
              </>
            ) : (
              <p className="text-lg font-medium">{formatKoreanDate(config.date, config.time)}</p>
            )}

            {dDay && (
              <div className="mt-5 inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-sm font-semibold tracking-[0.15em] text-accent">{dDay}</span>
              </div>
            )}
          </div>
          )}
        </div>
      </header>

      {config.eventMode !== 'THANK_YOU' && (
      <>
      {/* 02. BLESSING & INVITATION — 청사의 지혜와 축복 & 초대 말씀 */}
      <section id="blessing" className="px-6 pb-[72px]">
        <Reveal className="max-w-md mx-auto">
          {/* 청사 스토리텔링 카드 */}
          <div className="p-7 rounded-2xl bg-paper-deep border border-line/70 text-center relative overflow-hidden mb-8">
            <div className="flex justify-center mb-4">
              <BlueSnakeEmblem className="w-10 h-10 text-accent" />
            </div>

            <p className="text-xs font-semibold tracking-[0.25em] text-accent mb-3">
              BLESSING OF BLUE SNAKE
            </p>

            <h2 className="font-display text-xl font-semibold mb-4 leading-snug">
              푸른 뱀의 맑은 기운을 품고<br />
              우리 곁에 온 도현이
            </h2>

            <p className="text-[15px] leading-[2.1] text-ink/90 whitespace-pre-line">
              {`을사년(乙巳年), 푸른 뱀의 총명한 지혜와
맑은 봄의 생명력을 품고 태어난 도현이.

눈부신 푸른 하늘처럼 맑고
깊고 유연한 물결처럼 지혜롭게 자라나길 바라는
엄마, 아빠의 사랑 속에서
어느덧 건강하게 첫 번째 사계절을 맞이하였습니다.

도현이의 소중한 첫걸음을 함께 축복해 주세요.`}
            </p>
          </div>

          <SectionHeading eyebrow="INVITATION" title="초대합니다" />
          <p className="whitespace-pre-line text-center text-[17px] leading-[2] text-ink">
            {config.greetingMessage}
          </p>
        </Reveal>
      </section>

      </>
      )}

      {/* 03. OUR STORY — 성장 타임라인 */}
      {config.useStory !== false && story.length > 0 && (
        <section id="story" className="py-[72px] px-6 bg-paper-deep border-y border-line/60">
          <Reveal className="max-w-md mx-auto">
            <SectionHeading eyebrow="OUR STORY" title={`${config.babyName}의 첫 1년`} />
          </Reveal>

          <ol className="max-w-md mx-auto space-y-14 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-line/70 before:hidden">
            {story.map((img) => (
              <li key={img.id}>
                <Reveal>
                  <div className="rounded-2xl overflow-hidden border border-line/80 bg-paper shadow-sm">
                    <div className="aspect-[4/5] overflow-hidden bg-paper-deep flex justify-center items-center">
                      <img
                        src={img.url}
                        alt={img.caption || `${img.month}개월의 ${config.babyName}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <p className="text-xs font-semibold tracking-[0.2em] text-accent">
                        {img.month === 0 ? 'BIRTH' : `${img.month} MONTHS`}
                      </p>
                      {img.caption && (
                        <p className="mt-2 text-base text-ink leading-relaxed font-medium">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}

            <li>
              <Reveal className="text-center pt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-[0.2em]">
                  <BlueSnakeEmblem className="w-3.5 h-3.5 text-accent" />
                  <span>TODAY</span>
                </div>
                <p className="mt-3 font-display text-xl font-semibold">그리고 어느덧 첫 번째 생일</p>
              </Reveal>
            </li>
          </ol>
        </section>
      )}

      {/* 04. TMI */}
      {config.useTmi !== false && <TmiSection config={config} />}

      {/* 05. GALLERY */}
      {config.useGallery !== false && <Gallery config={config} />}

      {config.eventMode !== 'THANK_YOU' && (
      <>
      {/* 06. THE DAY — 행사 안내 */}
      <section id="day" className="py-[72px] px-6 bg-paper-deep border-y border-line/60">
        <Reveal className="max-w-md mx-auto">
          <SectionHeading eyebrow="THE DAY" title="행사 안내" />
          <dl className="space-y-6 text-center">
            <div>
              <dt className="text-sm text-mute mb-1 font-medium">일시</dt>
              <dd className="text-xl font-semibold leading-snug">
                {formatKoreanDate(config.date, '')}
                <br />
                {parts?.timeKo}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-mute mb-1 font-medium">장소</dt>
              <dd className="text-xl font-semibold leading-snug">{config.locationName}</dd>
            </div>
            <div>
              <dt className="text-sm text-mute mb-1 font-medium">주소</dt>
              <dd className="text-lg leading-snug text-ink/90">{config.locationAddress}</dd>
            </div>
            {config.parkingInfo && (
              <div>
                <dt className="text-sm text-mute mb-1 font-medium">주차 안내</dt>
                <dd className="text-base leading-relaxed text-ink/90 whitespace-pre-line">
                  {config.parkingInfo}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </section>

      {/* 07~08. LOCATION / PARKING */}
      <LocationBank config={config} showShare={false} />

      {/* 09. FAMILY */}
      <section id="family" className="pb-[72px] px-6 max-w-md mx-auto">
        <Reveal>
          <SectionHeading eyebrow="FAMILY" title={`${config.babyName}의 가족`} />
          <ul className="divide-y divide-line border-y border-line">
            <ContactRow role="아빠" name={config.fatherName} phone={config.fatherPhone} />
            <ContactRow role="엄마" name={config.motherName} phone={config.motherPhone} />
          </ul>
        </Reveal>
      </section>

      {/* 10. RSVP / QUIZ / GUESTBOOK */}
      <RsvpForm config={config} />
      {config.useQuiz !== false && <Quiz config={config} />}
      </>
      )}
      {config.eventMode !== 'THANK_YOU' && config.useGuestbook !== false && <Guestbook />}

      {config.eventMode === 'THANK_YOU' && <QuizWinnerAnnounce />}

      {/* 11. THANK YOU & SHARE */}
      {config.eventMode !== 'THANK_YOU' && (
      <footer className="py-[72px] px-6 bg-paper-deep text-center border-t border-line/60">
        <Reveal className="max-w-md mx-auto">
          <div className="flex justify-center mb-3">
            <BlueSnakeEmblem className="w-8 h-8 text-accent" />
          </div>
          <SectionHeading
            eyebrow="THANK YOU"
            title="감사합니다"
            description={`${config.babyName}의 첫돌을 축하해 주셔서 진심으로 감사드립니다`}
          />
          <ShareButton config={config} />
        </Reveal>
      </footer>
      )}

      {/* Admin Link */}
      <div className="py-6 text-center flex justify-center items-center">
        <a href="/admin" className="text-[11px] text-mute/30 hover:text-mute/60 transition-colors">
          Admin Settings
        </a>
      </div>
    </div>
  );
}

