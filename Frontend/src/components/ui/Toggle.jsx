import './Form.css';

export default function Toggle({
  id,
  checked = false,
  onChange,
  label,
  name,
  disabled = false,
}) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div
      className="toggle-wrapper"
      onClick={() => !disabled && onChange?.(!checked)}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      id={id}
    >
      <div className={`toggle-switch ${checked ? 'toggle-switch--active' : ''}`}>
        <div className="toggle-thumb" />
      </div>
      {label && <span className="toggle-label">{label}</span>}
      {name && <input type="hidden" name={name} value={checked ? 'true' : 'false'} />}
    </div>
  );
}
