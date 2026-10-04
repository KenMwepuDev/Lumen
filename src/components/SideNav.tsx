'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SideNavItem {
  id: string;
  href: string;
  label: ReactNode;
}

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  items: SideNavItem[];
  currentId?: string;
}

export function SideNav({ items, currentId, className, ...rest }: SideNavProps) {
  return (
    <nav className={cn('side', className)} aria-label="Sections" {...rest}>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-current={item.id === currentId ? true : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
