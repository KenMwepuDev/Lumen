'use client';

import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CarouselSlide {
  id: string;
  content: ReactNode;
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  slides: CarouselSlide[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  autoPlayMs?: number;
}

export function Carousel({
  slides,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  autoPlayMs,
  className,
  ...rest
}: CarouselProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultIndex);
  const index = controlled ?? uncontrolled;

  const go = (i: number) => {
    const next = ((i % slides.length) + slides.length) % slides.length;
    onIndexChange?.(next);
    if (controlled === undefined) setUncontrolled(next);
  };

  useEffect(() => {
    if (!autoPlayMs || slides.length < 2) return;
    const t = setInterval(() => go(index + 1), autoPlayMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayMs, index, slides.length]);

  return (
    <div className={cn('car', className)} {...rest}>
      <div className="car-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s) => (
          <div className="car-slide" key={s.id}>
            {s.content}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" className="car-nav prev" aria-label="Précédent" onClick={() => go(index - 1)}>
            ‹
          </button>
          <button type="button" className="car-nav next" aria-label="Suivant" onClick={() => go(index + 1)}>
            ›
          </button>
          <div className="car-dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index || undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
