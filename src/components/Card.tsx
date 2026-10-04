import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  soft?: boolean;
  children?: ReactNode;
}

export function Card({ soft, className, children, ...rest }: CardProps) {
  return (
    <div className={cn('c', soft && 's', className)} {...rest}>
      {children}
    </div>
  );
}
