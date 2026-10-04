'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cn('in', invalid && 'bad', className)} {...rest}>
      {children}
    </select>
  );
});
