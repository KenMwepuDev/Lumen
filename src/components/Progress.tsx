import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: string;
}

export function Progress({ value, color = 'var(--ac)', className, ...rest }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('pg', className)} {...rest}>
      <i style={{ width: `${clamped}%`, background: color }} />
    </div>
  );
}
