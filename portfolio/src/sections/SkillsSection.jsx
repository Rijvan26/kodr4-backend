import React from 'react';
import SkillsMarquee from '../components/SkillsMarquee';

/**
 * Section 4: Skills & technologies (#skills)
 */
export default function SkillsSection() {
  return (
    <section id="skills" className="pt-[72px]">
      <h2 className="heading-bar font-sans font-bold text-[clamp(24px,3vw,30px)] text-app-ink mb-7">
        Skills &amp; technologies
      </h2>
      <SkillsMarquee />
    </section>
  );
}
