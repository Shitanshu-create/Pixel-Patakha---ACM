import './PageHeader.css';

export default function PageHeader({
  title,
  subtitle,
  children,
  className = '',
}) {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-header__title-group">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="page-header__actions">{children}</div>}
    </div>
  );
}
