'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CommandItem {
  id: string;
  label: ReactNode;
  variant?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
  separatorBefore?: boolean;
}

export interface SummaryStat {
  label: ReactNode;
  value: ReactNode;
}

export interface ListHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  commands?: CommandItem[];
  onCommand?: (id: string) => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  filters?: ReactNode;
  trailing?: ReactNode;
  stats?: SummaryStat[];
}

export function ListHeader({
  commands = [],
  onCommand,
  title,
  subtitle,
  filters,
  trailing,
  stats,
  className,
  ...rest
}: ListHeaderProps) {
  return (
    <div className={cn('lh', className)} {...rest}>
      {commands.length > 0 && (
        <div className="cb" role="toolbar" aria-label="Commandes">
          {commands.map((cmd) => (
            <span key={cmd.id} style={{ display: 'contents' }}>
              {cmd.separatorBefore ? <span className="vs" /> : null}
              <button
                type="button"
                className={cn(
                  'cm',
                  cmd.variant === 'primary' && 'pri',
                  cmd.variant === 'danger' && 'dg',
                )}
                disabled={cmd.disabled}
                onClick={() => onCommand?.(cmd.id)}
              >
                {cmd.label}
              </button>
            </span>
          ))}
          {trailing != null && (
            <>
              <span className="sp" />
              {trailing}
            </>
          )}
        </div>
      )}
      {(title != null || filters != null) && (
        <div className="lr">
          {title != null && <span className="ttl">{title}</span>}
          {subtitle != null && (
            <span className="hint" style={{ margin: '0 8px 0 0' }}>
              {subtitle}
            </span>
          )}
          {filters}
        </div>
      )}
      {stats && stats.length > 0 && (
        <div className="sm">
          {stats.map((s, i) => (
            <span key={i}>
              {s.label}
              <b>{s.value}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
