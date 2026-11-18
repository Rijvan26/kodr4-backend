import React from 'react';
import Hero from '../components/Hero';

/**
 * Section 1: Home (#home)
 */
export default function HomeSection({ scrollToSection }) {
  return (
    <section id="home" className="pt-0">
      <Hero scrollToSection={scrollToSection} />
    </section>
  );
}
