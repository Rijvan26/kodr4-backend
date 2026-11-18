import React, { useState } from 'react';

/**
 * Navbar matching the exact visual style from the user's template:
 * - Logo "RK." with font-size: 30px, weight: 800, orange period
 * - Links with active color var(--accent) and centered 16px x 2px orange underline
 * - Black rounded button "Let’s talk ↗"
 * - Responsive <860px collapsible Menu
 */
export default function Navbar({ activeSection, scrollToSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-app-bg/90 backdrop-blur-md border-b border-transparent">
      <div className="max-w-[1080px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo: font-size 30px, tracking -0.06em */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="text-[30px] font-extrabold tracking-[-0.06em] text-app-ink select-none"
          aria-label="Home"
        >
          RK<b className="text-app-accent">.</b>
        </a>

        {/* Desktop Links (>= 860px) */}
        <nav
          className="hidden nav:flex items-center gap-7"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`relative text-[14px] font-semibold py-1 transition-colors duration-150 ${
                  isActive
                    ? 'text-app-accent'
                    : 'text-app-ink hover:text-app-accent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute left-1/2 -bottom-1 -ml-2 w-4 h-[2px] bg-app-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}

          {/* "Let's talk" CTA button */}
          <a
            href="mailto:khanrijvan2610@gmail.com"
            className="btn-hover inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-ink text-app-bg text-[13px] font-bold shadow-sm"
          >
            <span>Let’s talk</span>
            <span className="text-app-accent font-bold">↗</span>
          </a>
        </nav>

        {/* Mobile Menu Trigger (< 860px) */}
        <div className="nav:hidden flex items-center gap-3">
          <a
            href="mailto:khanrijvan2610@gmail.com"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-app-ink text-app-bg text-xs font-bold"
          >
            <span>Let’s talk</span>
            <span className="text-app-accent font-bold">↗</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            className="px-3.5 py-2 rounded-[10px] bg-app-card border border-app-line text-app-ink text-[13px] font-semibold cursor-pointer"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Menu Card Dropdown */}
      {mobileMenuOpen && (
        <div className="nav:hidden px-6 pb-4">
          <nav className="flex flex-col gap-3 p-5 rounded-[18px] bg-app-card border border-app-line shadow-lg">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`text-[14px] font-semibold py-1.5 flex items-center justify-between ${
                    isActive ? 'text-app-accent' : 'text-app-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-app-accent" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
