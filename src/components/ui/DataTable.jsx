import { SkeletonRow, EmptyState } from './Primitives';
import { IconSearch } from './icons';
import './data-table.css';

/**
 * DataTable
 * columns: [{ key, label, render?(row), className? }]
 * rows: array of data objects (must include a unique `_id`)
 * mobileCard(row): renders a compact card for <900px — if omitted, falls
 * back to stacking the same columns vertically.
 */
export function DataTable({ columns, rows, loading, emptyTitle, emptyDesc, mobileCard, onRowClick }) {
  if (loading) {
    return (
      <div className="dtable-skeleton">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} height={56} />)}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        icon={<IconSearch width={22} height={22} />}
        title={emptyTitle}
        desc={emptyDesc}
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="dtable-wrap">
        <table className="dtable">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} onClick={() => onRowClick?.(row)} className={onRowClick ? 'is-clickable' : ''}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="dtable-cards">
        {rows.map((row) => (
          <div key={row._id} className="dtable-card" onClick={() => onRowClick?.(row)}>
            {mobileCard ? mobileCard(row) : columns.map((col) => (
              <div key={col.key} className="dtable-card__row">
                <span className="dtable-card__label">{col.label}</span>
                <span className="dtable-card__value">{col.render ? col.render(row) : row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
