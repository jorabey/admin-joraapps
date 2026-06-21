import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Field } from './Field';
import { IconAlertTriangle } from './icons';
import './confirm-action-modal.css';

/**
 * ConfirmActionModal
 * Generic confirmation dialog for moderation actions. If `requireReason` is
 * true, a textarea is shown and the confirm button stays disabled until at
 * least 3 characters are entered — mirrors the server's Joi min-length rule
 * for suspend/reject/block reasons.
 */
export function ConfirmActionModal({
  open, onClose, onConfirm,
  title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'danger', // danger | primary
  requireReason = false,
  showOptionalReason = false,
  reasonLabel = 'Reason',
  reasonPlaceholder = 'Explain why...',
}) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const canConfirm = !requireReason || reason.trim().length >= 3;
  const showReasonField = requireReason || showOptionalReason;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setLoading(true);
    try {
      await onConfirm(showReasonField ? reason.trim() : undefined);
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} danger={variant === 'danger'} dismissable={!loading}>
      <div className="cam">
        <div className={`cam__icon ${variant === 'danger' ? 'cam__icon--danger' : ''}`}>
          <IconAlertTriangle width={24} height={24} />
        </div>
        <h3 className="cam__title display">{title}</h3>
        {description && <p className="cam__desc">{description}</p>}

        {showReasonField && (
          <div className="cam__reason">
            <Field
              label={reasonLabel}
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
            />
          </div>
        )}

        <div className="cam__actions">
          <Button variant="secondary" fullWidth onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            loading={loading}
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
