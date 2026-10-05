'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: ReactNode;
}

export function Collapse({ open, children, className, style, ...rest }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(open ? 'auto' : 0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      setAnimating(true);
      const h = el.scrollHeight;
      setHeight(h);
      const t = window.setTimeout(() => {
        setHeight('auto');
        setAnimating(false);
      }, 250);
      return () => clearTimeout(t);
    }
    setAnimating(true);
    setHeight(el.scrollHeight);
    requestAnimationFrame(() => setHeight(0));
    const t = window.setTimeout(() => setAnimating(false), 250);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div
      ref={ref}
      className={cn('cl', animating && 'animating', className)}
      data-open={open}
      style={{
        ...style,
        height: height === 'auto' ? undefined : height,
        display: !open && !animating ? 'none' : undefined,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
