'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Button } from './Button';

export type OffcanvasSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<OffcanvasSize, number> = {
  sm: 320,
  md: 400,
  lg: 520,
  xl: 640,
};

export interface OffcanvasProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** Lock document body scroll while open (default true) */
  lockScroll?: boolean;
  /** Show dimmed backdrop (default true) */
  backdrop?: boolean;
  closeLabel?: string;
  /** Preset width (overridden by width / defaultWidth) */
  size?: OffcanvasSize;
  /** Controlled width in px */
  width?: number;
  /** Uncontrolled initial width in px */
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  /** Show left-edge resize handle (default true) */
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
}

export function Offcanvas({
  open,
  onClose,
  title,
  footer,
  children,
  lockScroll = true,
  backdrop = true,
  closeLabel = 'Fermer',
  size = 'md',
  width: controlledWidth,
  defaultWidth,
  onWidthChange,
  resizable = true,
  minWidth = 280,
  maxWidth,
  className,
  style,
  ...rest
}: OffcanvasProps) {
  const initial = defaultWidth ?? SIZE_MAP[size];
  const [uncontrolledWidth, setUncontrolledWidth] = useState(initial);
  const [isDragging, setIsDragging] = useState(false);
  const width = controlledWidth ?? uncontrolledWidth;
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const clamp = useCallback(
    (w: number) => {
      const max = maxWidth ?? Math.min(window.innerWidth * 0.92, window.innerWidth - 48);
      return Math.round(Math.min(max, Math.max(minWidth, w)));
    },
    [minWidth, maxWidth],
  );

  const setWidth = useCallback(
    (w: number) => {
      const next = clamp(w);
      onWidthChange?.(next);
      if (controlledWidth === undefined) setUncontrolledWidth(next);
    },
    [clamp, onWidthChange, controlledWidth],
  );

  useEffect(() => {
    if (controlledWidth !== undefined) return;
    if (defaultWidth != null) return;
    setUncontrolledWidth(SIZE_MAP[size]);
  }, [size, controlledWidth, defaultWidth]);

  useEffect(() => {
    if (!open || !lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!resizable) return;

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      setWidth(startW.current + delta);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [resizable, setWidth]);

  const onHandlePointerDown = (e: ReactPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    startW.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  return (
    <>
      {backdrop ? (
        <div
          className={cn('oc-backdrop', open && 'open')}
          aria-hidden={!open}
          onClick={onClose}
        />
      ) : null}
      <div
        className={cn(
          'oc',
          open && 'open',
          resizable && 'oc-resizable',
          isDragging && 'oc-dragging',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        tabIndex={-1}
        style={{ ...style, width: `min(${width}px, 92vw)` }}
        {...rest}
      >
        {resizable ? (
          <div
            className="oc-handle"
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionner le panneau"
            aria-valuenow={width}
            aria-valuemin={minWidth}
            tabIndex={0}
            onPointerDown={onHandlePointerDown}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setWidth(width + 16);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setWidth(width - 16);
              } else if (e.key === 'Home') {
                e.preventDefault();
                setWidth(minWidth);
              } else if (e.key === 'End') {
                e.preventDefault();
                setWidth(maxWidth ?? window.innerWidth * 0.92);
              }
            }}
          >
            <span className="oc-handle-grip" aria-hidden="true" />
          </div>
        ) : null}
        <div className="oc-h">
          <h3>{title}</h3>
          <Button variant="text" aria-label={closeLabel} onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="oc-b">{children}</div>
        {footer != null ? <div className="oc-f">{footer}</div> : null}
      </div>
    </>
  );
}
