import React from 'react';
import { Sparkles, Code2, Layers, Cpu, Compass } from 'lucide-react';

/**
 * BentoGrid component:
 * 1. Profile photo card with name and role
 * 2. Short about tile
 * 3. Accent-colored stat tile
 * 4. Wide tile with an auto-scrolling tech stack strip
 */
export default function BentoGrid() {
  const techStack = [
    'React',
    'Tailwind CSS',
    'Figma',
    'JavaScript',
    'TypeScript',
    'Framer Motion',
    'Vite',
    'Git',
    'Design Systems',
    'Next.js',
    'Responsive UI',
    'Accessibility',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl mx-auto">
      {/* Tile 1: Profile Photo Card with Name and Role */}
      <div className="md:col-span-1 lg:col-span-1 rounded-[28px] p-6 bg-white dark:bg-[#16171b] border border-[#e6e7eb] dark:border-[#26282e] flex flex-col justify-between overflow-hidden relative group">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#e6e7eb] dark:bg-[#26282e] border-2 border-white dark:border-[#16171b] shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Profile portrait"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#16171b] flex items-center justify-center text-white text-[10px]">
            ✓
          </span>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#62646d] dark:text-[#9ca3af]">
            Location: Remote
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#101114] dark:text-white mt-1">
            Rizwan Khan
          </h2>
          <p className="text-sm text-[#62646d] dark:text-[#9ca3af] mt-0.5">
            Product Designer &amp; Frontend Engineer
          </p>
        </div>
      </div>

      {/* Tile 2: Short About Tile */}
      <div className="md:col-span-2 lg:col-span-2 rounded-[28px] p-6 sm:p-7 bg-white dark:bg-[#16171b] border border-[#e6e7eb] dark:border-[#26282e] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#f0f0f2] dark:bg-[#202126] flex items-center justify-center text-[#2f4bff] dark:text-[#7b8cff]">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-[#62646d] dark:text-[#9ca3af] px-3 py-1 rounded-full bg-[#f7f7f8] dark:bg-[#202126]">
            Philosophy
          </span>
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-[#101114] dark:text-white mb-2">
            Form follows function, elevated by precision.
          </h3>
          <p className="text-sm sm:text-base text-[#62646d] dark:text-[#9ca3af] leading-relaxed">
            I believe software should be as intuitive to use as it is pleasant to look at. Bridging the gap between conceptual UI mocks and production-grade frontend architecture.
          </p>
        </div>
      </div>

      {/* Tile 3: Accent-Colored Stat Tile */}
      <div className="md:col-span-3 lg:col-span-1 rounded-[28px] p-6 bg-[#2f4bff] dark:bg-[#7b8cff] text-white dark:text-[#0e0f12] flex flex-col justify-between border border-[#2f4bff] dark:border-[#7b8cff] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider opacity-80">
            Impact
          </span>
          <Sparkles className="w-5 h-5 opacity-90" />
        </div>
        <div className="my-4">
          <div className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight">
            5+ yrs
          </div>
          <p className="text-xs sm:text-sm font-medium mt-1 opacity-90">
            Delivering high-craft UI/UX
          </p>
        </div>
        <div className="pt-3 border-t border-white/20 dark:border-black/15 text-xs font-medium flex justify-between">
          <span>Shipped projects</span>
          <span className="font-bold">30+</span>
        </div>
      </div>

      {/* Tile 4: Wide Tile with Auto-Scrolling Tech Stack Strip */}
      <div className="md:col-span-3 lg:col-span-4 rounded-[28px] p-6 bg-white dark:bg-[#16171b] border border-[#e6e7eb] dark:border-[#26282e] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2f4bff] dark:text-[#7b8cff]" />
            <span className="font-heading font-bold text-sm text-[#101114] dark:text-white">
              Core Tech Stack &amp; Workflow
            </span>
          </div>
          <span className="text-xs text-[#62646d] dark:text-[#9ca3af]">Continuous delivery</span>
        </div>

        {/* Auto-scrolling horizontal strip */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max gap-3 py-1 animate-marquee motion-reduce:animate-none">
            {/* Duplicated list for infinite seamless marquee */}
            {[...techStack, ...techStack].map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f7f7f8] dark:bg-[#202126] border border-[#e6e7eb] dark:border-[#2a2b30] text-xs sm:text-sm font-medium text-[#101114] dark:text-[#f3f4f6] whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2f4bff] dark:bg-[#7b8cff]" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
