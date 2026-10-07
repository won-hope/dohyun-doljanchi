const fs = require('fs');
let content = fs.readFileSync('src/components/themes/TemplateBlueSnake.tsx', 'utf8');

// 1. Hide Date & D-Day block
const dateBlockOld = `
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
          </div>`;

const dateBlockNew = `
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
          )}`;

content = content.replace(dateBlockOld, dateBlockNew);

// 2. Enhance Thank You Message
const thankYouMsgOld = `            <>
              <h1 className="mt-4 font-display text-[32px] leading-tight font-semibold tracking-tight">
                함께해 주셔서<br/>감사합니다
              </h1>
              <p className="mt-4 text-base text-mute font-medium leading-relaxed">
                바쁘신 와중에도 {config.babyName}의 첫 생일을<br/>
                축하해 주셔서 진심으로 감사드립니다.
              </p>
              <AudioGreeting url={config.audioGreetingUrl || ''} />
            </>`;

const thankYouMsgNew = `            <>
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
            </>`;

content = content.replace(thankYouMsgOld, thankYouMsgNew);

// 3. Hide Footer
const footerOld = `      {/* 11. THANK YOU & SHARE */}
      <footer className="py-[72px] px-6 bg-paper-deep text-center border-t border-line/60">
        <Reveal className="max-w-md mx-auto">
          <div className="flex justify-center mb-3">
            <BlueSnakeEmblem className="w-8 h-8 text-accent" />
          </div>
          <SectionHeading
            eyebrow="THANK YOU"
            title="감사합니다"
            description={\`\${config.babyName}의 첫돌을 축하해 주셔서 진심으로 감사드립니다\`}
          />
          {config.eventMode !== 'THANK_YOU' && <ShareButton config={config} />}
        </Reveal>
      </footer>`;

const footerNew = `      {/* 11. THANK YOU & SHARE */}
      {config.eventMode !== 'THANK_YOU' && (
      <footer className="py-[72px] px-6 bg-paper-deep text-center border-t border-line/60">
        <Reveal className="max-w-md mx-auto">
          <div className="flex justify-center mb-3">
            <BlueSnakeEmblem className="w-8 h-8 text-accent" />
          </div>
          <SectionHeading
            eyebrow="THANK YOU"
            title="감사합니다"
            description={\`\${config.babyName}의 첫돌을 축하해 주셔서 진심으로 감사드립니다\`}
          />
          <ShareButton config={config} />
        </Reveal>
      </footer>
      )}`;

content = content.replace(footerOld, footerNew);

fs.writeFileSync('src/components/themes/TemplateBlueSnake.tsx', content);
