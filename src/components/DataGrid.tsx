'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Badge } from './Badge';
import type { BadgeVariant } from '../types';

export type DataGridColumnType = 'text' | 'num' | 'date' | 'sel' | 'calc';

export interface DataGridColumn<T> {
  /** Row field key, or a unique id for calculated columns */
  key: string;
  label: string;
  type: DataGridColumnType;
  options?: string[];
  /** Compute display/edit value for calc columns */
  compute?: (row: T) => number;
  format?: (value: unknown, row: T) => ReactNode;
  badgeMap?: Record<string, { label?: string; variant: BadgeVariant; prefix?: string }>;
}

export interface DataGridProps<T extends { id: string | number }> {
  columns: DataGridColumn<T>[];
  rows: T[];
  onRowsChange?: (rows: T[]) => void;
  selectedIds?: Array<string | number>;
  onSelectedIdsChange?: (ids: Array<string | number>) => void;
  compact?: boolean;
  className?: string;
  'aria-label'?: string;
  locale?: string;
  currency?: string;
  footerLabel?: (visibleCount: number) => string;
  onActiveCellChange?: (info: { rowId: string | number; colIndex: number } | null) => void;
}

function formatDate(v: unknown): string {
  if (typeof v !== 'string' || !v) return '';
  return v.split('-').reverse().join('/');
}

function formatEuro(v: number, locale: string, currency: string): string {
  return v.toLocaleString(locale, { style: 'currency', currency });
}

export function DataGrid<T extends { id: string | number }>({
  columns,
  rows,
  onRowsChange,
  selectedIds = [],
  onSelectedIdsChange,
  compact,
  className,
  'aria-label': ariaLabel = 'Editable grid',
  locale = 'fr-FR',
  currency = 'EUR',
  footerLabel,
  onActiveCellChange,
}: DataGridProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);
  const [cur, setCur] = useState<{ id: string | number; c: number } | null>(
    rows[0] ? { id: rows[0].id, c: 0 } : null,
  );
  const [ed, setEd] = useState<{ id: string | number; c: number; v: unknown } | null>(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const cellValue = useCallback((row: T, col: DataGridColumn<T>) => {
    if (col.type === 'calc' && col.compute) return col.compute(row);
    return (row as Record<string, unknown>)[col.key];
  }, []);

  const commitEdit = useCallback(
    (dr: number, dc: number, keep = false) => {
      if (!ed || !onRowsChange) {
        setEd(null);
        if (!keep) move(dr, dc);
        return;
      }
      const col = columns[ed.c];
      const next = rows.map((r) => {
        if (r.id !== ed.id) return r;
        const el = editRef.current;
        const raw = el ? el.value : String(ed.v ?? '');
        let value: unknown = raw;
        if (col.type === 'num') {
          const t = raw.trim().replace(',', '.');
          value = t === '' || Number.isNaN(+t) ? raw : +t;
        }
        return { ...r, [col.key]: value } as T;
      });
      onRowsChange(next);
      setEd(null);
      if (!keep) {
        requestAnimationFrame(() => move(dr, dc, next));
      }
    },
    // move is stable enough via cur/rows; intentionally omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ed, columns, rows, onRowsChange],
  );

  const move = useCallback(
    (dr: number, dc: number, sourceRows: T[] = rows) => {
      if (!cur || !sourceRows.length) return;
      const ri0 = sourceRows.findIndex((r) => r.id === cur.id);
      let c = cur.c + dc;
      let dr2 = dr;
      if (c > columns.length - 1) {
        c = 0;
        dr2 = dr2 || 1;
      }
      if (c < 0) {
        c = columns.length - 1;
        dr2 = dr2 || -1;
      }
      const ri = Math.max(0, Math.min(sourceRows.length - 1, ri0 + dr2));
      const next = { id: sourceRows[ri].id, c };
      setCur(next);
      onActiveCellChange?.({ rowId: next.id, colIndex: next.c });
      rootRef.current?.focus();
    },
    [cur, rows, columns.length, onActiveCellChange],
  );

  const startEdit = useCallback(
    (initial?: string) => {
      if (!cur) return;
      const row = rows.find((r) => r.id === cur.id);
      const col = columns[cur.c];
      if (!row || !col || col.type === 'calc') return;
      const v = initial !== undefined ? initial : cellValue(row, col);
      setEd({ id: cur.id, c: cur.c, v });
    },
    [cur, rows, columns, cellValue],
  );

  useEffect(() => {
    if (!ed) return;
    const el = editRef.current;
    if (!el) return;
    el.focus();
    if (el instanceof HTMLInputElement && el.type === 'text' && el.select) el.select();
  }, [ed]);

  useEffect(() => {
    onActiveCellChange?.(cur ? { rowId: cur.id, colIndex: cur.c } : null);
  }, [cur, onActiveCellChange]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (ed) return;
    const map: Record<string, [number, number]> = {
      ArrowDown: [1, 0],
      ArrowUp: [-1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      Tab: [0, e.shiftKey ? -1 : 1],
    };
    const m = map[e.key];
    if (m) {
      e.preventDefault();
      move(m[0], m[1]);
      return;
    }
    if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      startEdit();
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!cur || !onRowsChange) return;
      const col = columns[cur.c];
      if (col.type === 'calc' || col.type === 'sel') return;
      onRowsChange(
        rows.map((r) =>
          r.id === cur.id
            ? ({ ...r, [col.key]: col.type === 'num' ? 0 : '' } as T)
            : r,
        ),
      );
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && columns[cur?.c ?? 0]?.type !== 'calc') {
      e.preventDefault();
      startEdit(e.key);
    }
  };

  const onClick = (e: ReactMouseEvent) => {
    const td = (e.target as HTMLElement).closest('td');
    if (!td || ed) return;
    const idAttr = td.getAttribute('data-r');
    if (idAttr == null) return;
    const id = Number.isNaN(Number(idAttr)) ? idAttr : Number(idAttr);
    if (td.classList.contains('rn')) {
      const next = new Set(selectedSet);
      if (!e.ctrlKey && !e.metaKey) {
        next.clear();
        if (!selectedSet.has(id)) next.add(id);
      } else if (next.has(id)) next.delete(id);
      else next.add(id);
      onSelectedIdsChange?.([...next]);
    } else {
      const c = Number(td.getAttribute('data-c'));
      setCur({ id, c });
    }
    rootRef.current?.focus();
  };

  const onDblClick = (e: ReactMouseEvent) => {
    const td = (e.target as HTMLElement).closest('td');
    if (td?.getAttribute('data-c') != null) startEdit();
  };

  const qtyCol = columns.find((c) => c.key === 'q' && c.type === 'num');
  const totalCol = columns.find((c) => c.type === 'calc');
  const qtySum = qtyCol
    ? rows.reduce((a, r) => a + (Number((r as Record<string, unknown>)[qtyCol.key]) || 0), 0)
    : 0;
  const totalSum = totalCol?.compute
    ? rows.reduce((a, r) => a + (totalCol.compute?.(r) ?? 0), 0)
    : 0;

  return (
    <div
      ref={rootRef}
      className={cn('xs', compact && 'cp', className)}
      tabIndex={0}
      role="grid"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onDoubleClick={onDblClick}
    >
      <table className="x">
        <thead>
          <tr>
            <th className="rn" />
            {columns.map((c, i) => (
              <th
                key={c.key}
                className={c.type === 'num' || c.type === 'calc' ? 'nm' : undefined}
              >
                <small>{String.fromCharCode(65 + i)}</small>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.id} className={selectedSet.has(row.id) ? 'rs' : undefined}>
              <td className="rn" data-r={row.id}>
                {ri + 1}
              </td>
              {columns.map((col, ci) => {
                const v = cellValue(row, col);
                const bad = col.type === 'num' && Number.isNaN(Number(v));
                const isCur = cur?.id === row.id && cur.c === ci;
                const isEdit = ed?.id === row.id && ed.c === ci;
                const cls = cn(
                  (col.type === 'num' || col.type === 'calc') && 'nm',
                  col.type === 'calc' && 'ca',
                  bad && 'bad',
                  isCur && 'cur',
                );

                let content: ReactNode;
                if (isEdit) {
                  if (col.type === 'sel') {
                    content = (
                      <select
                        ref={(el) => {
                          editRef.current = el;
                        }}
                        defaultValue={String(v ?? '')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            commitEdit(1, 0);
                          } else if (e.key === 'Tab') {
                            e.preventDefault();
                            commitEdit(0, e.shiftKey ? -1 : 1);
                          } else if (e.key === 'Escape') {
                            setEd(null);
                            rootRef.current?.focus();
                          }
                        }}
                        onChange={() => commitEdit(0, 0)}
                        onBlur={() => commitEdit(0, 0, true)}
                      >
                        {(col.options ?? []).map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    );
                  } else {
                    content = (
                      <input
                        ref={(el) => {
                          editRef.current = el;
                        }}
                        id="ei"
                        type={col.type === 'date' ? 'date' : 'text'}
                        defaultValue={String(ed.v ?? v ?? '')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            commitEdit(1, 0);
                          } else if (e.key === 'Tab') {
                            e.preventDefault();
                            commitEdit(0, e.shiftKey ? -1 : 1);
                          } else if (e.key === 'Escape') {
                            setEd(null);
                            rootRef.current?.focus();
                          }
                        }}
                        onBlur={() => commitEdit(0, 0, true)}
                      />
                    );
                  }
                } else if (col.format) {
                  content = col.format(v, row);
                } else if (col.type === 'calc') {
                  content = formatEuro(Number(v) || 0, locale, currency);
                } else if (col.type === 'num') {
                  content = bad
                    ? `⚠ ${String(v)}`
                    : Number(v).toLocaleString(locale);
                } else if (col.type === 'date') {
                  content = formatDate(v);
                } else if (col.type === 'sel' && col.badgeMap) {
                  const meta = col.badgeMap[String(v)];
                  content = meta ? (
                    <Badge variant={meta.variant}>
                      {(meta.prefix ?? '') + (meta.label ?? String(v))}
                    </Badge>
                  ) : (
                    String(v)
                  );
                } else {
                  content = String(v ?? '');
                }

                return (
                  <td
                    key={col.key}
                    className={cls}
                    data-r={row.id}
                    data-c={ci}
                    role="gridcell"
                    title={bad ? 'Nombre attendu' : undefined}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="rn">Σ</td>
            <td colSpan={3}>
              {footerLabel ? footerLabel(rows.length) : `${rows.length} ligne(s)`}
            </td>
            <td />
            <td className="nm">{qtyCol ? qtySum.toLocaleString(locale) : ''}</td>
            <td />
            <td className="nm">
              {totalCol ? formatEuro(totalSum, locale, currency) : ''}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
