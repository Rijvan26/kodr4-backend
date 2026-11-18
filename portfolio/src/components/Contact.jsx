import React from 'react';

/**
 * Contact component matching the exact .cta layout from the template:
 * - Peach band with rounded top corners (24px 24px 0 0)
 * - 3-column grid (heading, direct mail/phone links, and social square buttons)
 * - Centered copyright notice with orange heart
 */
export default function Contact() {
  return (
    <div className="mt-20 bg-app-peach rounded-t-[24px] py-11 pb-7 px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 nav:grid-cols-[1.1fr_1.2fr_1fr] gap-8 items-center">
          {/* Column 1: Heading */}
          <div>
            <h2 className="font-sans font-bold text-[clamp(24px,3vw,30px)] text-app-ink leading-[1.2] m-0 p-0">
              Let’s build something<br />
              meaningful <em className="not-italic text-app-accent">together.</em>
            </h2>
          </div>

          {/* Column 2: Email & Phone Direct Info */}
          <div className="flex flex-col gap-2.5 text-[14px] font-medium text-app-ink">
            <a
              href="mailto:khanrijvan2610@gmail.com"
              className="flex items-center gap-3 hover:text-app-accent transition-colors"
            >
              <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>khanrijvan2610@gmail.com</span>
            </a>

            <a
              href="tel:+917389974179"
              className="flex items-center gap-3 hover:text-app-accent transition-colors"
            >
              <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 73899 74179</span>
            </a>
          </div>

          {/* Column 3: "Let's connect" + 3 Square Icon Buttons */}
          <div>
            <h3 className="font-sans font-bold text-[14px] text-app-ink mb-2.5">
              Let’s connect
            </h3>
            <div className="flex gap-2.5">
              {/* GitHub */}
              <a
                href="https://github.com/Rijvan26"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover w-[42px] h-[42px] rounded-[10px] border-[1.5px] border-app-ink bg-app-card grid place-items-center text-app-ink hover:text-app-accent"
                aria-label="GitHub Profile"
              >
                <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/rijvaan-khan-8884291b7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover w-[42px] h-[42px] rounded-[10px] border-[1.5px] border-app-ink bg-app-card grid place-items-center text-app-ink hover:text-app-accent"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:khanrijvan2610@gmail.com"
                className="btn-hover w-[42px] h-[42px] rounded-[10px] border-[1.5px] border-app-ink bg-app-card grid place-items-center text-app-ink hover:text-app-accent"
                aria-label="Direct Email"
              >
                <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright notice with orange heart */}
        <p className="text-center text-[12px] text-app-sub mt-8">
          © 2026 Rijvan Khan. All rights reserved. <b className="text-app-accent not-italic">♥</b>
        </p>
      </div>
    </div>
  );
}
