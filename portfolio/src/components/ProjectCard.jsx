import React from 'react';

/**
 * ProjectCard component matching the user's template:
 * - Simple browser-window mock (.win) inside tinted shot area (.shot)
 * - Heading with external link icon
 * - Description & peach-colored tag pills
 * - Live Demo and GitHub links in bold accent orange
 * - 4px hover lift with soft orange-tinted shadow
 */
export default function ProjectCard({ project }) {
  const isTintB = project.id === 'supportme';

  return (
    <article className="card-hover rounded-[18px] bg-app-card border border-app-line overflow-hidden flex flex-col justify-between">
      <div>
        {/* Tinted Preview Area with Browser Mock */}
        <div
          className={`h-[150px] grid place-items-center ${
            isTintB
              ? 'bg-[#eaf0f6] dark:bg-[#1b2430]'
              : 'bg-app-peach'
          }`}
        >
          <div className="w-[62%] bg-app-card border-2 border-app-ink rounded-[8px] p-2 pb-2.5 shadow-sm">
            {/* Window traffic light dots */}
            <div className="flex gap-[3px] mb-[7px]">
              <i className="w-[5px] h-[5px] rounded-full bg-app-ink opacity-50 not-italic" />
              <i className="w-[5px] h-[5px] rounded-full bg-app-ink opacity-50 not-italic" />
              <i className="w-[5px] h-[5px] rounded-full bg-app-ink opacity-50 not-italic" />
            </div>
            {/* Window mock content lines */}
            <div className="flex gap-1.5 mt-1.5 items-center">
              <s className="w-3 h-3 rounded-full bg-app-accent shrink-0 block no-underline" />
              <u className="flex-1 h-[5px] rounded-[4px] bg-app-line block no-underline" />
            </div>
            <div className="flex gap-1.5 mt-1.5 items-center">
              <s className="w-3 h-3 rounded-full bg-app-accent shrink-0 block no-underline" />
              <u className="flex-1 h-[5px] rounded-[4px] bg-app-line block no-underline" />
            </div>
            <div className="flex gap-1.5 mt-1.5 items-center">
              <s className="w-3 h-3 rounded-full bg-app-accent shrink-0 block no-underline" />
              <u className="flex-1 h-[5px] rounded-[4px] bg-app-line block no-underline" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-2 flex-1">
          <h3 className="font-sans font-bold text-[16px] text-app-ink flex items-center gap-2">
            <span>{project.name}</span>
            <svg
              className="w-3.5 h-3.5 text-app-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </h3>

          <p className="text-[13px] text-app-sub leading-normal">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap mt-auto pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] text-app-sub px-2.5 py-0.5 rounded-full bg-app-peach"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex gap-4 text-[13px] font-bold text-app-accent pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Live demo
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
