import React from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Footer component:
 * Single line with copyright notice and an accessible "Back to top" link
 * that scrolls smoothly to #home.
 */
export default function Footer({ scrollToSection }) {
  const handleBackToTop = (e) => {
    e.preventDefault();
    scrollToSection('home');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-[#e6e7eb] dark:border-[#26282e] mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#62646d] dark:text-[#9ca3af]">
        <p className="font-normal">
          &copy; {currentYear} Rizwan Khan. All rights reserved. Designed &amp; built with craft.
        </p>

        <a
          href="#home"
          onClick={handleBackToTop}
          className="inline-flex items-center gap-1.5 font-medium hover:text-[#101114] dark:hover:text-[#f3f4f6] transition-colors focus-visible:ring-2 focus-visible:ring-[#2f4bff] dark:focus-visible:ring-[#7b8cff] rounded-md px-1 py-0.5"
          aria-label="Scroll back to top of page"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </a>
      </div>
    </footer>
  );
}
