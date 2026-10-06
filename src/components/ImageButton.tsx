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

export type ImageButtonAlign = 'left' | 'center';

export interface ImageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon node (SVG, emoji, custom element) */
  icon?: ReactNode;
  /** Image URL used when `icon` is not provided */
  iconSrc?: string;
  iconAlt?: string;
  /** Text label next to the icon */
  children?: ReactNode;
  variant?: ButtonVariant;
  /** Horizontal alignment of the icon+text group */
  align?: ImageButtonAlign;
  /** Stretch to full container width */
  block?: boolean;
}

export function ImageButton({
  icon,
  iconSrc,
  iconAlt = '',
  children,
  variant = 'outlined',
  align = 'center',
  block = false,
  className,
  type = 'button',
  ...rest
}: ImageButtonProps) {
  const media =
    icon ??
    (iconSrc ? <img src={iconSrc} alt={iconAlt} /> : null);

  return (
    <button
      type={type}
      className={cn(
        'btn',
        'img',
        variantClass[variant],
        align === 'left' ? 'al-left' : 'al-center',
        block && 'block',
        className,
      )}
      {...rest}
    >
      {media != null ? <span className="btn-ico">{media}</span> : null}
      {children != null ? <span className="btn-txt">{children}</span> : null}
    </button>
  );
}
