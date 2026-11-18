import React from 'react';
import Achievements from '../components/Achievements';

/**
 * Section 5: Achievements (#achievements)
 */
export default function AchievementsSection() {
  return (
    <section id="achievements" className="pt-[72px]">
      <h2 className="heading-bar font-sans font-bold text-[clamp(24px,3vw,30px)] text-app-ink mb-7">
        Achievements
      </h2>
      <Achievements />
    </section>
  );
}
