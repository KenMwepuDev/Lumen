'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ScrollspySection {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface ScrollspyProps extends HTMLAttributes<HTMLDivElement> {
  sections: ScrollspySection[];
}

export function Scrollspy({ sections, className, ...rest }: ScrollspyProps) {
  const [current, setCurrent] = useState(sections[0]?.id ?? '');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll('section[id]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.id);
        }
      },
      { root, rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className={cn('sspy', className)} {...rest}>
      <nav className="sspy-nav" aria-label="Sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={s.id === current ? true : undefined}
            onClick={(e) => {
              e.preventDefault();
              contentRef.current?.querySelector(`#${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {s.title}
          </a>
        ))}
      </nav>
      <div className="sspy-content" ref={contentRef}>
        {sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h4>{s.title}</h4>
            <div>{s.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
