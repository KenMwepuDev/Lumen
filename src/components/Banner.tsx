'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Button } from './Button';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Banner({
  children,
  onDismiss,
  dismissLabel = 'Fermer',
  className,
  ...rest
}: BannerProps) {
  return (
    <div className={cn('ban', className)} {...rest}>
      <span>{children}</span>
      {onDismiss ? (
        <Button variant="text" onClick={onDismiss}>
          {dismissLabel}
        </Button>
      ) : null}
    </div>
  );
}
