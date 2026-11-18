import React from 'react';

/**
 * TraitGrid component matching the user's template:
 * 3-column inline grid (2-column on mobile) with orange stroke icons
 */
export default function TraitGrid() {
  const traits = [
    {
      title: 'Detail oriented',
      svg: (
        <svg className="w-5 h-5 text-app-accent stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      title: 'Problem solver',
      svg: (
        <svg className="w-5 h-5 text-app-accent stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: 'Clean code advocate',
      svg: (
        <svg className="w-5 h-5 text-app-accent stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      title: 'Always learning',
      svg: (
        <svg className="w-5 h-5 text-app-accent stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      title: 'Team player',
      svg: (
        <svg className="w-5 h-5 text-app-accent stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Curious mind',
      svg: (
        <svg className="w-5 h-5 text-app-accent stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4 mt-6">
      {traits.map((trait) => (
        <div key={trait.title} className="flex items-center gap-2.5 text-[13px] font-semibold text-app-ink">
          {trait.svg}
          <span>{trait.title}</span>
        </div>
      ))}
    </div>
  );
}
