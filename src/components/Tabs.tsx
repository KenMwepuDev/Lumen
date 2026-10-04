'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
}

export function Tabs({ items, value, onValueChange, className, ...rest }: TabsProps) {
  return (
    <div className={cn('tabs', className)} role="tablist" {...rest}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          onClick={() => onValueChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
