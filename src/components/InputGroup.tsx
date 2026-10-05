import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  prepend?: ReactNode;
  append?: ReactNode;
  children: ReactNode;
}

export function InputGroup({ prepend, append, children, className, ...rest }: InputGroupProps) {
  return (
    <div className={cn('ig', className)} {...rest}>
      {prepend != null ? <span className="ig-addon">{prepend}</span> : null}
      {children}
      {append != null ? <span className="ig-addon">{append}</span> : null}
    </div>
  );
}
