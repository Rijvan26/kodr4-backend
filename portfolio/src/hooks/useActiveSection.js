import { useState, useEffect, useCallback } from 'react';

/**
 * Custom scroll spy hook using IntersectionObserver.
 * Tracks current active section among: home, work, about, skills, achievements, process, contact.
 * Highlights contact when reaching the bottom of the viewport.
 */
export function useActiveSection(
  sectionIds = ['home', 'work', 'about', 'skills', 'achievements', 'process', 'contact']
) {
  const [activeSection, setActiveSection] = useState('home');

  // Check prefers-reduced-motion media query
  const getPrefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Smooth scroll to target section and update URL hash
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const reducedMotion = getPrefersReducedMotion();
    el.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    window.history.pushState(null, '', `#${id}`);
    setActiveSection(id);
  }, []);

  useEffect(() => {
    // Check initial hash on mount
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && sectionIds.includes(initialHash)) {
      const el = document.getElementById(initialHash);
      if (el) {
        setTimeout(() => {
          const reducedMotion = getPrefersReducedMotion();
          el.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
          setActiveSection(initialHash);
        }, 150);
      }
    }

    // Scroll event for bottom of page detection -> highlight contact
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const bodyHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollY >= bodyHeight - 50) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver for tracking sections in view
    const observerCallback = (entries) => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const bodyHeight = document.documentElement.scrollHeight;
      if (windowHeight + scrollY >= bodyHeight - 50) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-25% 0px -45% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [sectionIds]);

  return { activeSection, setActiveSection, scrollToSection };
}
