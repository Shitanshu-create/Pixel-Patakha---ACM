import './Toast.css';

const TOAST_ICONS = {
  success: '✓',
  error: '✖',
  warning: '⚠',
  info: 'ℹ',
};

export default function Toast({ id, type = 'info', message, onClose }) {
  const icon = TOAST_ICONS[type] || 'ℹ';

  return (
    <div className={`toast toast--${type}`} role="status">
      <span className="toast__icon" aria-hidden="true">{icon}</span>
      <div className="toast__content">{message}</div>
      {onClose && (
        <button
          type="button"
          className="toast__close"
          onClick={() => onClose(id)}
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
