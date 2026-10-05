'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Button, type ButtonProps } from './Button';

export interface DropdownItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  separatorBefore?: boolean;
}

export interface DropdownProps {
  label: ReactNode;
  items: DropdownItem[];
  onSelect?: (id: string) => void;
  variant?: ButtonProps['variant'];
  align?: 'start' | 'end';
  className?: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export function Dropdown({
  label,
  items,
  onSelect,
  variant = 'secondary',
  align = 'start',
  className,
  buttonProps,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

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
  }, [open]);

  return (
    <div className={cn('dd', open && 'open', className)} ref={rootRef}>
      <Button
        variant={variant}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        {...buttonProps}
      >
        {label} ▾
      </Button>
      <div
        id={menuId}
        className="dd-menu"
        role="menu"
        data-align={align === 'end' ? 'end' : undefined}
      >
        {items.map((item) => (
          <span key={item.id} style={{ display: 'contents' }}>
            {item.separatorBefore ? <div className="dd-sep" role="separator" /> : null}
            <button
              type="button"
              role="menuitem"
              className={cn('dd-item', item.danger && 'dg')}
              disabled={item.disabled}
              onClick={() => {
                onSelect?.(item.id);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
