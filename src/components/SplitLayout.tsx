'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SplitLayoutProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  main: ReactNode;
  panel: ReactNode;
  panelLabel?: string;
}

export function SplitLayout({
  open = false,
  main,
  panel,
  panelLabel = 'Panel',
  className,
  ...rest
}: SplitLayoutProps) {
  return (
    <div className={cn('split', open && 'open', className)} {...rest}>
      {main}
      <aside className="pan" aria-label={panelLabel}>
        {panel}
      </aside>
    </div>
  );
}
