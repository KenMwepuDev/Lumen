import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  nav: ReactNode;
  children: ReactNode;
}

export function AppShell({ nav, children, className, ...rest }: AppShellProps) {
  return (
    <div className={cn('app', className)} {...rest}>
      <nav>{nav}</nav>
      <div className="w">{children}</div>
    </div>
  );
}
