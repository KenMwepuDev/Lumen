import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
}

export function Skeleton({ width, className, style, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn('sk', className)}
      style={{ width, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
