'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'title'> {
  title?: ReactNode;
  content: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  title,
  content,
  children,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  className,
  ...rest
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (controlled === undefined) setUncontrolled(v);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <span
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={id}
        style={{ display: 'inline-flex' }}
      >
        {children}
      </span>
      {open ? (
        <div id={id} className="pop" role="dialog" {...rest}>
          {title != null ? <div className="pop-title">{title}</div> : null}
          <div className="pop-body">{content}</div>
        </div>
      ) : null}
    </div>
  );
}
