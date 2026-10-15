import { SPRITES, COLOR_MAP } from './sprites.js';

export default function PixelSprite({
  name = 'coin',
  size = 24,
  className = '',
  style = {},
  ariaLabel,
}) {
  const grid = SPRITES[name];
  if (!grid || !grid.length) return null;

  const height = grid.length;
  const width = Math.max(...grid.map((row) => row.length));

  return (
    <svg
      width={size}
      height={(size / width) * height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={`pixel-sprite pixelated ${className}`}
      style={style}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : 'presentation'}
    >
      {grid.map((row, y) =>
        row.split('').map((char, x) => {
          if (char === '.' || !COLOR_MAP[char]) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={COLOR_MAP[char]}
            />
          );
        })
      )}
    </svg>
  );
}
