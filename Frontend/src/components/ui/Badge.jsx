import './Badge.css';

const DEFAULT_ICONS = {
  yellow: '★',
  cyan: 'ℹ',
  purple: '◆',
  green: '✓',
  pink: '⚠',
  muted: '●',
};

export default function Badge({
  children,
  tone = 'cyan', // yellow | cyan | purple | green | pink | muted
  icon,
  className = '',
  ...props
}) {
  const displayIcon = icon !== undefined ? icon : DEFAULT_ICONS[tone] || '●';

  return (
    <span className={`badge badge--${tone} ${className}`} {...props}>
      {displayIcon && <span className="badge__icon" aria-hidden="true">{displayIcon}</span>}
      <span className="badge__text">{children}</span>
    </span>
  );
}
