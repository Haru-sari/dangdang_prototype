import { BigButton } from './BigButton';

interface Props {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function ConfirmDialog({ message, confirmLabel, cancelLabel, onConfirm, onCancel, busy }: Props) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-message">
        <p id="dialog-message" className="dialog__message">
          {message}
        </p>
        <BigButton variant="danger" onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </BigButton>
        <BigButton variant="secondary" onClick={onCancel} disabled={busy} autoFocus>
          {cancelLabel}
        </BigButton>
      </div>
    </div>
  );
}
