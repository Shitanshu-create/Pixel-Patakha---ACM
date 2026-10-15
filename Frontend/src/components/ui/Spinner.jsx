import './Spinner.css';

export default function Spinner({
  size = 'md', // sm | md | lg
  text = 'Loading...',
  showText = false,
  className = '',
}) {
  return (
    <div className={`spinner-container ${className}`} role="status">
      <div className={`spinner-pixel spinner-pixel--${size}`} aria-hidden="true">
        <div className="spinner-pixel__block spinner-pixel__block--1" />
        <div className="spinner-pixel__block spinner-pixel__block--2" />
        <div className="spinner-pixel__block spinner-pixel__block--3" />
        <div className="spinner-pixel__block spinner-pixel__block--4" />
      </div>
      <span className={showText ? 'spinner-text' : 'sr-only'}>{text}</span>
    </div>
  );
}
