import type { HTMLAttributes, ReactNode } from 'react';
import type { BadgeVariant } from '../types';
import { cn } from '../utils/cn';

const variantClass: Record<BadgeVariant, string> = {
  ok: 'bo',
  warn: 'bw',
  error: 'be',
  info: 'bi',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: ReactNode;
}

export function Badge({ variant = 'info', className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn('badge', variantClass[variant], className)} {...rest}>
      {children}
    </span>
  );
}
