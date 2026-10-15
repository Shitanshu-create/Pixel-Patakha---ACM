import './Alert.css';

const ALERT_ICONS = {
  error: '✖',
  warning: '⚠',
  success: '✓',
  info: 'ℹ',
};

export default function Alert({
  variant = 'info', // error | warning | success | info
  title,
  message,
  children,
  className = '',
  ...props
}) {
  const icon = ALERT_ICONS[variant] || 'ℹ';

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`alert alert--${variant} ${className}`}
      {...props}
    >
      <span className="alert__icon" aria-hidden="true">{icon}</span>
      <div className="alert__body">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{message || children}</div>
      </div>
    </div>
  );
}
