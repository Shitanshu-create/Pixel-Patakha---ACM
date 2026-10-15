import './FormField.css';

export default function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  children,
  className = '',
}) {
  const hintId = hint && id ? `${id}-hint` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <div className="form-field__label-row">
          <label htmlFor={id} className="form-field__label">
            {label}
            {required && <span className="form-field__required" aria-hidden="true">*</span>}
          </label>
        </div>
      )}

      {/* Clone or wrap children if function or pass describedBy */}
      {typeof children === 'function' ? (
        children({ id, error: !!error, describedBy })
      ) : (
        children
      )}

      {hint && (
        <div id={hintId} className="form-field__hint">
          {hint}
        </div>
      )}

      {error && (
        <div id={errorId} className="form-field__error" role="alert">
          <span className="form-field__error-icon" aria-hidden="true">✖</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
