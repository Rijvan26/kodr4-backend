import React from 'react';
import { Palette, Code2 } from 'lucide-react';

/**
 * SkillGroup component:
 * Renders categorized skills with craft-focused layout and visual badges.
 */
export default function SkillGroup({ title, description, skills }) {
  const isDesign = title.toLowerCase().includes('design');

  return (
    <div className="rounded-[28px] p-6 sm:p-8 bg-white dark:bg-[#16171b] border border-[#e6e7eb] dark:border-[#26282e] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#f0f0f2] dark:bg-[#202126] flex items-center justify-center text-[#2f4bff] dark:text-[#7b8cff]">
            {isDesign ? <Palette className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
          </div>
          <h3 className="font-heading font-bold text-2xl text-[#101114] dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-sm text-[#62646d] dark:text-[#9ca3af] leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#f7f7f8] dark:bg-[#202126] border border-[#e6e7eb]/70 dark:border-[#26282e]"
          >
            <span className="font-medium text-sm text-[#101114] dark:text-[#f3f4f6]">
              {skill.name}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-[#16171b] text-[#62646d] dark:text-[#9ca3af] border border-[#e6e7eb] dark:border-[#2a2b30]">
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
