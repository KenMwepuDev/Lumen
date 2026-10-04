import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface RecordHeaderField {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
}

export interface RecordHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  entity?: ReactNode;
  title: ReactNode;
  fields?: RecordHeaderField[];
}

export function RecordHeader({
  entity,
  title,
  fields = [],
  className,
  ...rest
}: RecordHeaderProps) {
  return (
    <div className={cn('rh', className)} {...rest}>
      <div>
        {entity != null && <small>{entity}</small>}
        <div className="ttl">{title}</div>
      </div>
      {fields.map((f, i) => (
        <div className="kf" key={i}>
          <small>{f.label}</small>
          <b>{f.value}</b>
          {f.hint != null && <small>{f.hint}</small>}
        </div>
      ))}
    </div>
  );
}
