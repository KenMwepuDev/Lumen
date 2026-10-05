'use client';

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';

function isFilled(value: unknown, defaultValue: unknown): boolean {
  const v = value ?? defaultValue;
  if (v == null) return false;
  return String(v).length > 0;
}

export interface FloatingLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  invalid?: boolean;
}

export function FloatingLabel({
  label,
  invalid,
  className,
  id,
  placeholder = ' ',
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  ...rest
}: FloatingLabelProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState(() => isFilled(value, defaultValue));
  const filled = value !== undefined ? isFilled(value, undefined) : internal;
  const float = focused || filled;

  return (
    <div className={cn('fl', float && 'is-float', className)}>
      <input
        id={inputId}
        className={cn('in', invalid && 'bad')}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          if (value === undefined) setInternal(e.target.value.length > 0);
          onBlur?.(e);
        }}
        onChange={(e) => {
          if (value === undefined) setInternal(e.target.value.length > 0);
          onChange?.(e);
        }}
        {...rest}
      />
      <label htmlFor={inputId}>{label}</label>
    </div>
  );
}

export interface FloatingSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  invalid?: boolean;
}

export function FloatingSelect({
  label,
  invalid,
  className,
  id,
  children,
  ...rest
}: FloatingSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className={cn('fl', 'select', 'is-float', className)}>
      <select id={selectId} className={cn('in', invalid && 'bad')} {...rest}>
        {children}
      </select>
      <label htmlFor={selectId}>{label}</label>
    </div>
  );
}
