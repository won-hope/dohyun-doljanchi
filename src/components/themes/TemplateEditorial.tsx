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
    'inline-flex items-center justify-center min-h-[44px] min-w-[64px] px-4 rounded-full border border-line text-[15px] font-medium text-ink hover:bg-paper-deep';
  return (
    <li className="flex items-center justify-between gap-4 py-5">
      <div>
        <p className="text-sm text-mute">{role}</p>
        <p className="font-display text-xl font-semibold">{name}</p>
      </div>
      {phone && (
        <div className="flex gap-2">
          <a href={`tel:${phone}`} className={btn} aria-label={`${role} ${name}에게 전화하기`}>전화</a>
          <a href={`sms:${phone}`} className={btn} aria-label={`${role} ${name}에게 문자 보내기`}>문자</a>
        </div>
      )}
    </li>
  );
}

export default function TemplateEditorial({ config }: { config: InvitationConfig }) {
  const parts = getDateParts(config.date, config.time);
  const dDay = getDDay(config.date);
  const story = [...(config.scrollImages ?? [])].sort((a, b) => a.month - b.month);

  return (
    <div className="bg-paper text-ink pb-24">
      {/* 01. COVER — 사진과 정보를 분리: 사진 위에는 아무것도 올리지 않습니다 */}
      <header>
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-paper-deep">
          {config.mainCoverImage && (
            <img
              src={config.mainCoverImage}
              alt={`${config.babyName}의 첫돌 사진`}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: `50% ${config.coverFocusY ?? 30}%` }}
            />
          )}
        </div>

        <div className="px-6 pt-12 pb-[72px] text-center">
          <p className="text-sm font-medium tracking-[0.3em] text-accent">ONE YEAR OLD</p>
          <h1 className="mt-4 font-display text-[36px] leading-tight font-semibold">
            {config.babyName}의 첫돌
          </h1>

          <div className="mt-8">
            {parts ? (
              <>
                <p className="font-display text-[26px] tracking-wide">
                  {parts.ymd}{' '}
                  <span className="text-base tracking-[0.2em] text-mute">{parts.weekdayEn}</span>
                </p>
                <p className="mt-1 text-lg">{parts.weekdayKo} {parts.timeKo}</p>
              </>
            ) : (
              <p className="text-lg">{formatKoreanDate(config.date, config.time)}</p>
            )}
            {dDay && <p className="mt-4 text-sm font-medium tracking-[0.2em] text-accent">{dDay}</p>}
          </div>
        </div>
      </header>

      {/* 02. MESSAGE */}
      <section id="message" className="px-6 pb-[72px]">
        <Reveal className="max-w-md mx-auto">
          <SectionHeading eyebrow="INVITATION" title="초대합니다" />
          <p className="whitespace-pre-line text-center text-[17px] leading-[2] text-ink">
            {config.greetingMessage}
          </p>
        </Reveal>
      </section>

      {/* 03. OUR STORY — 성장 타임라인 사진이 등록된 경우에만 표시 */}
      {config.useStory !== false && story.length > 0 && (
        <section id="story" className="py-[72px] px-6 bg-paper-deep">
          <Reveal className="max-w-md mx-auto">
            <SectionHeading eyebrow="OUR STORY" title={`${config.babyName}의 첫 1년`} />
          </Reveal>
          <ol className="max-w-md mx-auto space-y-14">
            {story.map((img) => (
              <li key={img.id}>
                <Reveal>
                  <div className="aspect-[4/5] overflow-hidden bg-paper">
                    <img
                      src={img.url}
                      alt={img.caption || `${img.month}개월의 ${config.babyName}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: '50% 30%' }}
                    />
                  </div>
                  {img.month > 0 && (
                    <p className="mt-5 text-sm font-medium tracking-[0.22em] text-accent">{img.month}개월</p>
                  )}
                  {img.caption && <p className="mt-2 text-[17px] leading-[1.8]">{img.caption}</p>}
                </Reveal>
              </li>
            ))}
            <li>
              <Reveal className="text-center pt-6">
                <p className="text-sm font-medium tracking-[0.22em] text-accent">TODAY</p>
                <p className="mt-2 font-display text-xl">그리고 어느덧 첫 번째 생일</p>
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
      {/* 06. THE DAY — 날짜·시간·장소를 한눈에 */}
      <section id="day" className="py-[72px] px-6 bg-paper-deep">
        <Reveal className="max-w-md mx-auto">
          <SectionHeading eyebrow="THE DAY" title="행사 안내" />
          <dl className="space-y-6 text-center">
            <div>
              <dt className="text-sm text-mute mb-1">일시</dt>
              <dd className="text-xl font-medium leading-snug">
                {formatKoreanDate(config.date, '')}
                <br />
                {parts?.timeKo}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-mute mb-1">장소</dt>
              <dd className="text-xl font-medium leading-snug">{config.locationName}</dd>
            </div>
            <div>
              <dt className="text-sm text-mute mb-1">주소</dt>
              <dd className="text-lg leading-snug">{config.locationAddress}</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      {/* 07~08. LOCATION / PARKING (공유 버튼은 마지막 THANK YOU 에서) */}
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

      {/* 10. RSVP / EVENT / GUESTBOOK */}
      <RsvpForm config={config} />
      {config.useQuiz !== false && <Quiz config={config} />}
      {config.useGuestbook !== false && <Guestbook />}
      </>
      )}

      {config.eventMode === 'THANK_YOU' && <QuizWinnerAnnounce />}
      {/* 11. THANK YOU */}
      {config.eventMode !== 'THANK_YOU' && (
      <footer className="py-[72px] px-6 bg-paper-deep text-center">
        <Reveal className="max-w-md mx-auto">
          <SectionHeading
            eyebrow="THANK YOU"
            title="감사합니다"
            description={`${config.babyName}의 첫돌을 축하해 주셔서 감사합니다`}
          />
          <ShareButton config={config} />
        </Reveal>
      </footer>
      )}
    </div>
  );
}
