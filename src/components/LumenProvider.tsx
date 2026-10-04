'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { LumenDensity, LumenStyle, LumenTheme } from '../types';
import { cn } from '../utils/cn';

export interface LumenContextValue {
  theme: LumenTheme;
  style: LumenStyle;
  density: LumenDensity;
  setTheme: (theme: LumenTheme) => void;
  setStyle: (style: LumenStyle) => void;
  setDensity: (density: LumenDensity) => void;
}

const LumenContext = createContext<LumenContextValue | null>(null);

export interface LumenProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  theme?: LumenTheme;
  style?: LumenStyle;
  density?: LumenDensity;
  onThemeChange?: (theme: LumenTheme) => void;
  onStyleChange?: (style: LumenStyle) => void;
  onDensityChange?: (density: LumenDensity) => void;
  children: ReactNode;
}

export function LumenProvider({
  theme = 'auto',
  style = 'modern',
  density = 'standard',
  onThemeChange,
  onStyleChange,
  onDensityChange,
  className,
  children,
  ...rest
}: LumenProviderProps) {
  const setTheme = useCallback(
    (next: LumenTheme) => {
      onThemeChange?.(next);
    },
    [onThemeChange],
  );
  const setStyle = useCallback(
    (next: LumenStyle) => {
      onStyleChange?.(next);
    },
    [onStyleChange],
  );
  const setDensity = useCallback(
    (next: LumenDensity) => {
      onDensityChange?.(next);
    },
    [onDensityChange],
  );

  const value = useMemo(
    () => ({ theme, style, density, setTheme, setStyle, setDensity }),
    [theme, style, density, setTheme, setStyle, setDensity],
  );

  return (
    <LumenContext.Provider value={value}>
      <div
        className={cn('lumen', className)}
        data-theme={theme === 'auto' ? undefined : theme}
        data-style={style === 'd365' ? 'd365' : undefined}
        data-density={density === 'standard' ? undefined : density}
        {...rest}
      >
        {children}
      </div>
    </LumenContext.Provider>
  );
}

export function useLumen(): LumenContextValue {
  const ctx = useContext(LumenContext);
  if (!ctx) {
    throw new Error('useLumen must be used within a LumenProvider');
  }
  return ctx;
}
