'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonVariant } from '../types';
import { cn } from '../utils/cn';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'p',
  secondary: 's',
  inverted: 'i',
  outlined: 'o',
  text: 't',
  danger: 'd',
  tonal: 'ton',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
}

export function Button({
  variant = 'secondary',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn('btn', variantClass[variant], className)} {...rest}>
      {children}
    </button>
  );
}
