'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  icon?: ReactNode;
}

export function SearchField({
  icon = '🔍',
  className,
  style,
  ...rest
}: SearchFieldProps) {
  return (
    <label className={cn('sr', className)} style={style}>
      {icon}
      <input type="search" {...rest} />
    </label>
  );
}
