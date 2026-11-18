import React from 'react';

/**
 * Achievements component matching the exact timeline (.tl) layout from the template:
 * - 3 columns (1 column on mobile)
 * - 60px x 60px round peach icon circles (.circ)
 * - Date/Badge in orange, title, subtitle, and description
 */
export default function Achievements() {
  const wins = [
    {
      date: 'June 2026',
      title: '4th place at a hackathon',
      subtitle: 'Fullstack developer and tester',
      desc: 'Helped build a backend visualization web app with React Flow, Gemini API and Monaco Editor, and presented it in a live demo.',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
    },
    {
      date: 'Certification',
      title: 'KODR Bootcamp',
      subtitle: 'Sheryians Coding School',
      desc: 'Full stack development and data structures and algorithms.',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {wins.map((w, idx) => (
        <div key={idx} className="flex gap-4 items-start">
          {/* 60px x 60px round peach circle */}
          <div className="w-[60px] h-[60px] rounded-full bg-app-peach text-app-ink grid place-items-center shrink-0">
            {w.icon}
          </div>
          <div>
            <small className="text-app-accent font-bold text-[12px] block">
              {w.date}
            </small>
            <h3 className="font-sans font-bold text-[16px] text-app-ink my-0.5">
              {w.title}
            </h3>
            <small className="text-app-sub font-semibold text-[12px] block mb-1">
              {w.subtitle}
            </small>
            <p className="text-app-sub text-[13px] leading-relaxed">
              {w.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
