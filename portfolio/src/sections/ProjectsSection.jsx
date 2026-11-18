import React, { useState, useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import { projectsData } from '../data/projects';

/**
 * Section 2: Projects
 * Features filter tabs (All, Design, Development) and a responsive 2-column grid.
 */
export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'Design' },
    { id: 'development', label: 'Development' },
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projectsData;
    return projectsData.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());
  }, [activeFilter]);

  return (
    <section id="projects" className="scroll-mt-24 px-4 sm:px-6 mb-24 sm:mb-32 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#101114] dark:text-white tracking-tight">
            Selected Works
          </h2>
          <p className="text-[#62646d] dark:text-[#9ca3af] text-sm sm:text-base mt-2 max-w-md">
            A curated showcase of design systems, web applications, and interactive digital products.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white dark:bg-[#16171b] border border-[#e6e7eb] dark:border-[#26282e] shadow-sm self-start sm:self-auto">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#101114] text-white dark:bg-[#f3f4f6] dark:text-[#101114] shadow-sm'
                    : 'text-[#62646d] hover:text-[#101114] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                } focus-visible:ring-2 focus-visible:ring-[#2f4bff] dark:focus-visible:ring-[#7b8cff]`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid (1 column on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
