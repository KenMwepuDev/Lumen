'use client';

import { useEffect, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export function Dialog({ open, onClose, className, children, ...rest }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn(className)}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.();
      }}
      {...rest}
    >
      {children}
    </dialog>
  );
}
