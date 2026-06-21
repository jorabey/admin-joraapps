import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from './icons';
import './modal.css';

export function Modal({ open, onClose, title, children, footer, danger = false, dismissable = true, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && dismissable) onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, dismissable]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={() => dismissable && onClose?.()}>
      <div
        className={`modal modal--${size} ${danger ? 'modal--danger' : ''}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal__header">
            <h3 className="modal__title display">{title}</h3>
            {dismissable && (
              <button className="modal__close" onClick={onClose} aria-label="Close">
                <IconX width={17} height={17} />
              </button>
            )}
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
