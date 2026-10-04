import type { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

export function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
  ...rest
}: FieldProps) {
  return (
    <div className={className}>
      <label className="f" {...rest}>
        {label}
        {required ? <span style={{ color: 'var(--er)' }}> *</span> : null}
      </label>
      {children}
      {error ? (
        <div className="er">{error}</div>
      ) : hint ? (
        <div className="hint">{hint}</div>
      ) : null}
    </div>
  );
}
