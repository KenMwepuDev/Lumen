import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: string;
  label?: ReactNode;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  animated?: boolean;
}

export function Progress({
  value,
  color = 'var(--ac)',
  label,
  showValue,
  size = 'md',
  striped,
  animated,
  className,
  ...rest
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={className} {...rest}>
      {(label != null || showValue) && (
        <div className="pg-label">
          <span>{label}</span>
          {showValue ? <span>{Math.round(clamped)}%</span> : null}
        </div>
      )}
      <div className={cn('pg', size === 'lg' && 'lg', striped && 'striped', animated && 'animated')}>
        <i style={{ width: `${clamped}%`, background: color }} />
      </div>
    </div>
  );
}
