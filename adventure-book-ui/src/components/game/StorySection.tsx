import type { Section } from '../../types';

interface StorySectionProps {
  section: Section;
}

export function StorySection({ section }: StorySectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="story-text text-slate-200 whitespace-pre-wrap leading-relaxed">
        {section.text}
      </div>
    </div>
  );
}
