import React from 'react';

/**
 * Hero Component matching the exact layout and line-art SVG from the template:
 * - Left: "Hi, I'm" with underline, "Rijvan Khan" with orange Khan, role, lead paragraph, and 2 buttons
 * - Right: Exact line-art SVG with beanbag, laptop, lamp, books, and plant
 */
export default function Hero({ scrollToSection }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-8 items-center pt-8 sm:pt-12">
      {/* Left Column */}
      <div>
        {/* "Hi, I'm" with 26px x 2px orange underline */}
        <span className="relative inline-block font-semibold text-[16px] text-app-ink pb-2 mb-1.5 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[26px] after:h-[2px] after:bg-app-accent">
          Hi, I’m
        </span>

        {/* Title: clamp(46px, 7vw, 76px), weight: 800 */}
        <h1 className="font-sans font-extrabold text-[46px] sm:text-[62px] lg:text-[76px] tracking-[-0.045em] leading-[1.08] text-app-ink mb-1">
          Rijvan <em className="not-italic text-app-accent">Khan</em>
        </h1>

        {/* Role */}
        <p className="font-semibold text-app-sub text-[17px] my-3 sm:my-4">
          MERN Stack Developer
        </p>

        {/* Lead */}
        <p className="max-w-[420px] text-app-sub text-[15px] leading-[1.7] mb-7">
          I build and deploy full-stack products that are fast, secure and well tested. From the database to the interface, I turn ideas into working software.
        </p>

        {/* Button Row */}
        <div className="flex flex-wrap gap-3">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('work');
            }}
            className="btn-hover inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-app-accent border border-app-accent text-app-on-accent font-bold text-[13px] shadow-sm cursor-pointer"
          >
            <span>View my work</span>
            <span>↗</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
            className="btn-hover inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border-[1.5px] border-app-ink bg-transparent text-app-ink font-bold text-[13px] cursor-pointer"
          >
            <span>Contact me</span>
          </a>
        </div>
      </div>

      {/* Right Column: Exact Line-Art SVG from template */}
      <div className="flex justify-center lg:justify-end">
        <svg
          className="w-full max-w-[460px] lg:max-w-[520px] h-auto text-app-ink"
          viewBox="0 0 520 380"
          role="img"
          aria-label="Illustration of a developer working on a laptop"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Ceiling lamp cord and shade */}
          <line x1="160" y1="0" x2="160" y2="46" />
          <path d="M126 86 Q126 48 160 48 Q194 48 194 86 Z" fill="var(--card)" />
          {/* Lamp orange bulb */}
          <circle cx="160" cy="98" r="5" fill="var(--accent)" stroke="var(--accent)" />
          {/* Lamp orange light rays */}
          <line x1="145" y1="114" x2="140" y2="124" stroke="var(--accent)" />
          <line x1="160" y1="116" x2="160" y2="128" stroke="var(--accent)" />
          <line x1="175" y1="114" x2="180" y2="124" stroke="var(--accent)" />

          {/* Wall shelf */}
          <line x1="340" y1="92" x2="500" y2="92" />
          {/* Books on shelf */}
          <rect x="352" y="42" width="12" height="50" fill="var(--card)" />
          <rect x="366" y="34" width="12" height="58" fill="var(--accent)" stroke="var(--accent)" />
          <rect x="380" y="46" width="12" height="46" fill="var(--card)" />

          {/* Plant pot & leaves on shelf */}
          <path d="M440 92 L444 70 L476 70 L480 92 Z" fill="var(--accent)" stroke="var(--accent)" />
          <path d="M460 70 Q460 50 452 40 M460 70 Q462 46 478 38 M460 66 Q444 60 438 48" />

          {/* Orange Beanbag (filled with var(--accent)) */}
          <path
            d="M296 340 C284 250 330 172 400 162 C474 152 512 224 500 300 C496 330 482 340 462 340 Z"
            fill="var(--accent)"
            stroke="var(--accent)"
          />

          {/* Developer body / shirt */}
          <path d="M372 168 C352 196 348 236 364 266 L446 266 C446 226 436 190 414 168 Z" fill="var(--card)" />

          {/* Head & Hair */}
          <circle cx="388" cy="132" r="28" fill="var(--card)" />
          <circle cx="374" cy="108" r="17" fill="currentColor" />
          <circle cx="395" cy="103" r="17" fill="currentColor" />
          <circle cx="410" cy="120" r="12" fill="currentColor" />
          <circle cx="364" cy="126" r="10" fill="currentColor" />

          {/* Glasses & nose */}
          <circle cx="380" cy="136" r="7" />
          <circle cx="399" cy="136" r="7" />
          <line x1="387" y1="136" x2="392" y2="136" />
          <path d="M381 150 Q389 156 397 150" />

          {/* Laptop with orange dot */}
          <path d="M276 210 L336 198 L346 260 L288 270 Z" fill="var(--card)" />
          <circle cx="312" cy="234" r="5" fill="var(--accent)" stroke="var(--accent)" />

          {/* Arms holding laptop */}
          <path d="M376 188 C356 216 340 236 326 248" />
          <path d="M400 196 C380 226 360 244 340 256" />

          {/* Legs & orange shoe */}
          <path d="M398 266 L346 292 L304 326" stroke="currentColor" strokeWidth="26" />
          <ellipse cx="294" cy="334" rx="22" ry="10" fill="var(--accent)" stroke="currentColor" />

          {/* Ground baseline */}
          <line x1="20" y1="344" x2="500" y2="344" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  );
}
