import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({
  children,
  variant = 'primary', // primary | secondary | danger | ghost
  size = 'md', // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled = false,
  to,
  href,
  className = '',
  type = 'button',
  icon,
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="btn-spinner pixelated" aria-hidden="true">■</span>
      ) : (
        icon && <span className="btn-icon" aria-hidden="true">{icon}</span>
      )}
      <span>{children}</span>
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled && !loading) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}
