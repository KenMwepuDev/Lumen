'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cn('in', invalid && 'bad', className)} {...rest} />;
});
