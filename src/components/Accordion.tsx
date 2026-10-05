'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: AccordionItem[];
  /** Allow multiple panels open */
  multiple?: boolean;
  defaultOpenIds?: string[];
  openIds?: string[];
  onOpenChange?: (ids: string[]) => void;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpenIds = [],
  openIds: controlled,
  onOpenChange,
  className,
  ...rest
}: AccordionProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpenIds);
  const openIds = controlled ?? uncontrolled;

  const toggle = (id: string) => {
    let next: string[];
    if (multiple) {
      next = openIds.includes(id) ? openIds.filter((x) => x !== id) : [...openIds, id];
    } else {
      next = openIds.includes(id) ? [] : [id];
    }
    onOpenChange?.(next);
    if (controlled === undefined) setUncontrolled(next);
  };

  return (
    <div className={cn('acc', className)} {...rest}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        return (
          <div className="acc-item" key={item.id}>
            <button
              type="button"
              className="acc-btn"
              aria-expanded={open}
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span>
              <span className="acc-chevron" aria-hidden="true" />
            </button>
            <div className={cn('acc-panel', open && 'open')}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );
}
