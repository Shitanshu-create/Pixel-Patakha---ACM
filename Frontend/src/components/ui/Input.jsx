import './Form.css';

export default function Input({
  id,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      aria-invalid={error ? 'true' : undefined}
      className={`form-control ${error ? 'form-control--error' : ''} ${className}`}
      {...props}
    />
  );
}
