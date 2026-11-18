import React from 'react';
import TraitGrid from '../components/TraitGrid';

/**
 * Section 3: About (#about)
 * Features:
 * - Left: Exact line-art SVG (developer with orange mug & stack of books)
 * - Right: Heading "About me" with 30px x 3px orange underline, paragraph, and 6 traits
 */
export default function AboutSection() {
  return (
    <section id="about" className="pt-[72px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-12 items-center">
        {/* Left: Line-Art SVG of developer with mug and books */}
        <div className="flex justify-center">
          <svg
            className="w-full max-w-[380px] h-auto text-app-ink"
            viewBox="0 0 380 300"
            role="img"
            aria-label="Illustration of a developer with a mug and books"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Window frame in background */}
            <path d="M40 30 Q40 6 80 6 Q120 6 120 30 L120 120 L40 120 Z" fill="var(--card)" />
            <line x1="80" y1="6" x2="80" y2="120" />

            {/* Head & Hair */}
            <circle cx="190" cy="104" r="34" fill="var(--card)" />
            <circle cx="176" cy="76" r="19" fill="currentColor" />
            <circle cx="200" cy="72" r="19" fill="currentColor" />
            <circle cx="218" cy="90" r="13" fill="currentColor" />
            <circle cx="182" cy="108" r="7" />
            <circle cx="203" cy="108" r="7" />
            <path d="M184 124 Q193 130 202 124" />

            {/* Torso */}
            <path d="M120 270 C118 200 140 160 190 150 C240 160 262 200 262 270 Z" fill="var(--card)" />

            {/* Arm holding orange mug */}
            <path d="M214 214 C240 218 252 206 252 192" />
            {/* Orange Mug */}
            <rect x="236" y="168" width="30" height="34" rx="6" fill="var(--accent)" stroke="var(--accent)" />
            <path d="M266 176 a10 10 0 0 1 0 20" />

            {/* Stack of books on right */}
            <rect x="262" y="246" width="96" height="14" fill="var(--card)" />
            <rect x="268" y="232" width="84" height="14" fill="var(--card)" />
            <rect x="274" y="218" width="74" height="14" fill="var(--card)" />

            {/* Table surface */}
            <line x1="30" y1="270" x2="360" y2="270" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Right: Text & Traits */}
        <div>
          <h2 className="heading-bar font-sans font-bold text-[clamp(24px,3vw,30px)] text-app-ink mb-7">
            About me
          </h2>
          <p className="text-app-sub text-[15px] leading-[1.7]">
            I’m a MERN stack developer who cares about secure, tested and well-built products. I design REST APIs, build clean React interfaces and write the automated tests that keep them working.
          </p>
          <TraitGrid />
        </div>
      </div>
    </section>
  );
}
