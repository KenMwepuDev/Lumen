'use client';

import { useMemo, useState, type HTMLAttributes, type ReactNode, type TableHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  width?: string | number;
}

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
  className,
  ...rest
}: PaginationProps) {
  const pages = useMemo(() => {
    const max = Math.max(1, pageCount);
    const window = 5;
    let start = Math.max(1, page - Math.floor(window / 2));
    let end = Math.min(max, start + window - 1);
    start = Math.max(1, end - window + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, pageCount]);

  const from = totalItems != null && pageSize != null ? (page - 1) * pageSize + 1 : null;
  const to =
    totalItems != null && pageSize != null ? Math.min(totalItems, page * pageSize) : null;

  return (
    <div className={cn('pag', className)} {...rest}>
      <div className="pag-info">
        {from != null && to != null && totalItems != null
          ? `${from}–${to} sur ${totalItems}`
          : `Page ${page} / ${Math.max(1, pageCount)}`}
      </div>
      <div className="pag-btns">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Précédent">
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Suivant"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export interface TableProps<T extends { id: string | number }>
  extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<T>[];
  rows: T[];
  pageSize?: number;
  empty?: ReactNode;
}

export function Table<T extends { id: string | number }>({
  columns,
  rows,
  pageSize = 5,
  empty = 'Aucune donnée',
  className,
  ...rest
}: TableProps<T>) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const slice = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className={cn('tbl-wrap', className)}>
      <table {...rest}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={c.width != null ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          ) : (
            slice.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.key}>{c.cell(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination
        page={safePage}
        pageCount={pageCount}
        pageSize={pageSize}
        totalItems={rows.length}
        onPageChange={setPage}
      />
    </div>
  );
}
