import React from 'react';
import { skillsList } from '../data/skills';

/**
 * SkillsMarquee component combining the exact tile styling from the template:
 * - Rounded-[18px] card with soft shadow
 * - 44px x 44px peach monogram square with bold orange letters
 * - Continuous infinite CSS scrolling animation (Left-to-Right and Right-to-Left)
 * - Gradient edge masking, pause on hover/focus, and prefers-reduced-motion fallback
 */
export default function SkillsMarquee() {
  const row1 = skillsList.slice(0, 12);
  const row2 = skillsList.slice(12);

  return (
    <div className="marquee-wrapper space-y-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] py-1">
      {/* Row 1: Left to Right Marquee */}
      <div className="flex w-max gap-3.5 animate-marquee-ltr marquee-track">
        {[...row1, ...row1].map((skill, idx) => (
          <div
            key={`r1-${skill.name}-${idx}`}
            className="w-[108px] shrink-0 rounded-[18px] p-[16px_8px_14px] bg-app-card border border-app-line text-center card-hover shadow-[0_8px_20px_-16px_rgba(242,106,27,0.5)] select-none"
          >
            <b className="grid place-items-center w-[44px] h-[44px] mx-auto mb-2.5 rounded-[12px] bg-app-peach text-app-accent font-extrabold text-[16px] tracking-[-0.03em] not-italic">
              {skill.monogram}
            </b>
            <span className="text-[12px] font-semibold text-app-ink block truncate" title={skill.name}>
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2: Right to Left Marquee */}
      <div className="flex w-max gap-3.5 animate-marquee-rtl marquee-track">
        {[...row2, ...row2].map((skill, idx) => (
          <div
            key={`r2-${skill.name}-${idx}`}
            className="w-[108px] shrink-0 rounded-[18px] p-[16px_8px_14px] bg-app-card border border-app-line text-center card-hover shadow-[0_8px_20px_-16px_rgba(242,106,27,0.5)] select-none"
          >
            <b className="grid place-items-center w-[44px] h-[44px] mx-auto mb-2.5 rounded-[12px] bg-app-peach text-app-accent font-extrabold text-[16px] tracking-[-0.03em] not-italic">
              {skill.monogram}
            </b>
            <span className="text-[12px] font-semibold text-app-ink block truncate" title={skill.name}>
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
