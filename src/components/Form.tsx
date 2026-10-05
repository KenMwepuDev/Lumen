import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function Form({ className, children, ...rest }: FormProps) {
  return (
    <form className={cn('form', className)} {...rest}>
      {children}
    </form>
  );
}

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormRow({ className, children, ...rest }: FormRowProps) {
  return (
    <div className={cn('form-row', className)} {...rest}>
      {children}
    </div>
  );
}

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormActions({ className, children, ...rest }: FormActionsProps) {
  return (
    <div className={cn('form-actions', className)} {...rest}>
      {children}
    </div>
  );
}
