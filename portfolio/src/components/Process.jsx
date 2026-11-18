import React from 'react';

/**
 * Process component matching the exact .proc layout from the template:
 * - 5 steps in a row (2-col on mobile <=760px)
 * - 64px x 64px peach circle with centered icon
 * - Dashed orange line connecting steps on desktop
 * - 01..05 badge, title, and one-line summary
 */
export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Understand',
      desc: 'Learn the problem and who it is for.',
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Plan',
      desc: 'Define the data model and API first.',
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Build',
      desc: 'Write the API and the React interface.',
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Test',
      desc: 'Write tests and try to break it.',
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      num: '05',
      title: 'Ship',
      desc: 'Deploy, share a demo and improve.',
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div key={step.num} className="relative">
            {/* Round peach circle with dashed connector */}
            <div className="relative mx-auto mb-2.5 w-16 h-16 rounded-full bg-app-peach text-app-ink grid place-items-center">
              {step.icon}
              {/* Dashed connector line on desktop only */}
              {!isLast && (
                <span
                  className="hidden md:block absolute left-full top-1/2 w-[calc(100%-20px)] ml-2.5 border-t-2 border-dashed border-app-accent opacity-45 pointer-events-none"
                  aria-hidden="true"
                />
              )}
            </div>

            <small className="text-app-accent font-bold text-[12px] block">
              {step.num}
            </small>
            <h3 className="font-sans font-bold text-[14px] text-app-ink my-0.5">
              {step.title}
            </h3>
            <p className="text-[12px] text-app-sub leading-normal">
              {step.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
