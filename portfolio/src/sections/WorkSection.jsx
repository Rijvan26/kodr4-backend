import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { projectsData } from '../data/projects';

/**
 * Section 2: Selected work (#work)
 */
export default function WorkSection() {
  return (
    <section id="work" className="pt-[72px]">
      <div className="flex justify-between items-start gap-3 mb-7">
        <h2 className="heading-bar font-sans font-bold text-[clamp(24px,3vw,30px)] text-app-ink">
          Selected work
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
