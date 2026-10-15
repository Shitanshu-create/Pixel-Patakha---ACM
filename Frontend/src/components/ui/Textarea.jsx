import './Form.css';

export default function Textarea({
  id,
  rows = 4,
  error,
  className = '',
  ...props
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      aria-invalid={error ? 'true' : undefined}
      className={`form-control ${error ? 'form-control--error' : ''} ${className}`}
      {...props}
    />
  );
}
