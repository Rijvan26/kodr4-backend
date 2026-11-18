import React from 'react';
import Process from '../components/Process';

/**
 * Section 6: My process (#process)
 */
export default function ProcessSection() {
  return (
    <section id="process" className="pt-[72px]">
      <h2 className="heading-bar font-sans font-bold text-[clamp(24px,3vw,30px)] text-app-ink mb-7">
        My process
      </h2>
      <Process />
    </section>
  );
}
