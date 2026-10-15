import './Card.css';

export default function Card({
  children,
  accent = 'muted', // cyan | purple | yellow | pink | muted
  interactive = false,
  pixelCorners = true,
  className = '',
  ...props
}) {
  const classes = [
    'card',
    `card--${accent}`,
    interactive ? 'card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {pixelCorners && (
        <>
          <span className="card__corner card__corner--tl" aria-hidden="true" />
          <span className="card__corner card__corner--tr" aria-hidden="true" />
          <span className="card__corner card__corner--bl" aria-hidden="true" />
          <span className="card__corner card__corner--br" aria-hidden="true" />
        </>
      )}
      {children}
    </div>
  );
}
