'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  children?: ReactNode;
}

export function Chip({
  pressed = false,
  className,
  type = 'button',
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn('chip', className)}
      aria-pressed={pressed}
      {...rest}
    >
      {children}
    </button>
  );
}
