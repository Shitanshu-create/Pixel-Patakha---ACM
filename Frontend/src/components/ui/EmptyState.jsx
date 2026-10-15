import './State.css';

export default function EmptyState({
  title = 'No Data Found',
  description = 'Nothing has been created here yet. Details will appear once activity starts.',
  icon = '◻',
  action,
  className = '',
}) {
  return (
    <div className={`state-panel ${className}`}>
      <div className="state-panel__icon" aria-hidden="true">{icon}</div>
      <h3 className="state-panel__title">{title}</h3>
      <p className="state-panel__description">{description}</p>
      {action && <div className="state-panel__action">{action}</div>}
    </div>
  );
}
