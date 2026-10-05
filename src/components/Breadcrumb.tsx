import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  id: string;
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...rest }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className={className} {...rest}>
      <ol className="bc">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.id}>
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
