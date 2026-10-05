'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  showValue?: boolean;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(function Range(
  { label, showValue = true, className, value, defaultValue, ...rest },
  ref,
) {
  const display = value ?? defaultValue;
  return (
    <div className={cn('rng-wrap', className)}>
      {(label != null || showValue) && (
        <div className="rng-meta">
          <span>{label}</span>
          {showValue && display != null ? <span>{String(display)}</span> : null}
        </div>
      )}
      <input ref={ref} type="range" className="rng" value={value} defaultValue={defaultValue} {...rest} />
    </div>
  );
});
