import Button from './Button.jsx';
import './State.css';

export default function ErrorState({
  title = 'Something Went Wrong',
  description = 'Failed to load content from the server. Please check your connection and retry.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`state-panel state-panel--error ${className}`} role="alert">
      <div className="state-panel__icon" style={{ color: 'var(--color-error-red)' }} aria-hidden="true">
        ⚠
      </div>
      <h3 className="state-panel__title">{title}</h3>
      <p className="state-panel__description">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} size="sm">
          Retry Action
        </Button>
      )}
    </div>
  );
}
