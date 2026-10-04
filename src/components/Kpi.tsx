import type { HTMLAttributes, ReactNode } from 'react';
import type { KpiVariant } from '../types';
import { cn } from '../utils/cn';

const variantClass: Record<KpiVariant, string | undefined> = {
  default: undefined,
  ok: 'ok',
  sec: 'sec',
  wa: 'wa',
  er: 'er',
};

export interface KpiProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  variant?: KpiVariant;
}

export function Kpi({
  label,
  value,
  description,
  variant = 'default',
  className,
  ...rest
}: KpiProps) {
  return (
    <div className={cn('kpi', variantClass[variant], className)} {...rest}>
      {label != null && <small>{label}</small>}
      <strong>{value}</strong>
      {description != null && <span className="lb">{description}</span>}
    </div>
  );
}
