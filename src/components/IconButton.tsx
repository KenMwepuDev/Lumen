'use client';

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: 'round' | 'square';
  background?: string;
  children?: ReactNode;
}

export function IconButton({
  shape = 'round',
  background,
  className,
  style,
  type = 'button',
  children,
  ...rest
}: IconButtonProps) {
  const merged: CSSProperties = { ...style };
  if (background) merged.background = background;

  return (
    <button
      type={type}
      className={cn(shape === 'round' ? 'rb' : 'sq', className)}
      style={merged}
      {...rest}
    >
      {children}
    </button>
  );
}
