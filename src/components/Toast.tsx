'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ToastVariant = 'default' | 'ok' | 'wa' | 'er';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastRecord extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  /** Simple API (backward compatible) */
  toast: (message: string, variant?: ToastVariant) => void;
  push: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
  max?: number;
}

export function ToastProvider({ children, duration = 3000, max = 4 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastRecord[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems((list) => list.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (options: ToastOptions) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setItems((list) => {
        const next = [...list, { ...options, id }];
        return next.slice(-max);
      });
      const ms = options.duration ?? duration;
      if (ms > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), ms),
        );
      }
      return id;
    },
    [duration, max, dismiss],
  );

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'default') => {
      push({ message, variant });
    },
    [push],
  );

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    },
    [],
  );

  const value = useMemo(() => ({ toast, push, dismiss }), [toast, push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {items.map((item) => (
          <div
            key={item.id}
            className={`toast-item${item.variant && item.variant !== 'default' ? ` ${item.variant}` : ''}`}
            role="status"
          >
            <span className="tx">{item.message}</span>
            <button type="button" aria-label="Fermer" onClick={() => dismiss(item.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
      {/* Keep legacy single toast class for CSS compatibility if empty */}
      <div className="lumen-toast" role="status" style={{ display: 'none' }} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
