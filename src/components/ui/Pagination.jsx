import { IconChevronLeft, IconChevronRight } from './icons';
import { useLang } from '../../context/LangContext';
import './pagination.css';

export function Pagination({ page, totalPages, onChange }) {
  const { t } = useLang();
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <IconChevronLeft width={16} height={16} />
      </button>
      <span className="pagination__label">
        {t('page')} <strong>{page}</strong> {t('of')} {totalPages}
      </span>
      <button
        className="pagination__btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <IconChevronRight width={16} height={16} />
      </button>
    </div>
  );
}
