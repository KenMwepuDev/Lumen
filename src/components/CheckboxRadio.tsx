'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, disabled, id, ...rest },
  ref,
) {
  return (
    <label className={cn('ck', className)} data-disabled={disabled || undefined} htmlFor={id}>
      <input ref={ref} id={id} type="checkbox" disabled={disabled} {...rest} />
      {label != null ? <span>{label}</span> : null}
    </label>
  );
});

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, disabled, id, ...rest },
  ref,
) {
  return (
    <label className={cn('rd', className)} data-disabled={disabled || undefined} htmlFor={id}>
      <input ref={ref} id={id} type="radio" disabled={disabled} {...rest} />
      {label != null ? <span>{label}</span> : null}
    </label>
  );
});

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, id, ...rest },
  ref,
) {
  return (
    <label className={cn('sw', className)} htmlFor={id}>
      <input ref={ref} id={id} type="checkbox" role="switch" {...rest} />
      {label != null ? <span>{label}</span> : null}
    </label>
  );
});
