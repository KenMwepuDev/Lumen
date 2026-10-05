'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ListGroupItem {
  id: string;
  label: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
  active?: boolean;
  action?: boolean;
}

export interface ListGroupProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  items: ListGroupItem[];
  onSelect?: (id: string) => void;
}

export function ListGroup({ items, onSelect, className, ...rest }: ListGroupProps) {
  return (
    <ul className={cn('lg', className)} {...rest}>
      {items.map((item) => {
        const actionable = Boolean(item.action || onSelect);
        return (
          <li key={item.id} style={{ display: 'contents' }}>
            {actionable ? (
              <button
                type="button"
                className={cn('lg-item', 'action', item.active && 'active')}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) onSelect?.(item.id);
                }}
              >
                <span>{item.label}</span>
                {item.meta != null ? <span>{item.meta}</span> : null}
              </button>
            ) : (
              <div className={cn('lg-item', item.active && 'active')}>
                <span>{item.label}</span>
                {item.meta != null ? <span>{item.meta}</span> : null}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
