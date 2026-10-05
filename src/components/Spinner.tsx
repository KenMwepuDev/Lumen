import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_PX = { sm: 16, md: 28, lg: 40 } as const;
const STROKE = { sm: 2.5, md: 3, lg: 3.5 } as const;

export function Spinner({ size = 'md', label = 'Chargement', className, ...rest }: SpinnerProps) {
  const px = SIZE_PX[size];
  const stroke = STROKE[size];
  const r = 10;
  const c = 2 * Math.PI * r;

  return (
    <span
      className={cn('spn', `spn-${size}`, className)}
      role="status"
      aria-label={label}
      {...rest}
    >
      <svg width={px} height={px} viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          stroke="var(--sub)"
          strokeWidth={stroke}
        />
        <circle
          className="spn-arc"
          cx="12"
          cy="12"
          r={r}
          fill="none"
          stroke="var(--ac)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * 0.28} ${c}`}
        />
      </svg>
    </span>
  );
}
