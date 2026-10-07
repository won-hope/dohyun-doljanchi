'use client';
import { InvitationConfig } from '@/types';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function TmiSection({ config }: { config: InvitationConfig }) {
  if (!config.tmiItems || config.tmiItems.length === 0) return null;

  return (
    <section id="tmi" className="py-12 px-6 max-w-md mx-auto">
      <Reveal>
        <SectionHeading eyebrow="TMI" title={`${config.babyName}의 TMI`} description="우리가 몰랐던 작은 비밀들" />

        <dl className="divide-y divide-line border-y border-line">
          {config.tmiItems.map((item) => (
            <div key={item.id} className="py-6">
              <dt className="text-base font-bold leading-relaxed text-accent">Q. {item.question}</dt>
              <dd className="mt-2 text-[17px] leading-[1.8] text-ink">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
