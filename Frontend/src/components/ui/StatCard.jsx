import './PageHeader.css';

export default function StatCard({
  label,
  value,
  icon = '◆',
  tone = 'cyan', // cyan | purple | yellow | green | pink
  className = '',
}) {
  const colorMap = {
    cyan: 'var(--color-electric-cyan)',
    purple: 'var(--color-voxel-purple)',
    yellow: 'var(--color-arcade-yellow)',
    green: 'var(--color-success-green)',
    pink: 'var(--color-pixel-pink)',
  };

  const statColor = colorMap[tone] || colorMap.cyan;

  return (
    <div
      className={`stat-card ${className}`}
      style={{ '--stat-color': statColor }}
    >
      <div className="stat-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
      </div>
    </div>
  );
}
