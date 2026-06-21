import { IconSearch } from './icons';
import './toolbar.css';

export function Toolbar({ search, onSearchChange, searchPlaceholder, filters, right }) {
  return (
    <div className="toolbar">
      {onSearchChange && (
        <div className="toolbar__search">
          <IconSearch width={16} height={16} />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      )}
      {filters && <div className="toolbar__filters">{filters}</div>}
      {right && <div className="toolbar__right">{right}</div>}
    </div>
  );
}

export function SelectFilter({ value, onChange, options }) {
  return (
    <select className="select-filter" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
