import { useMemo } from 'react';
import './PixelStars.css';

const STAR_COLORS = [
  'var(--color-cloud-white)',
  'var(--color-electric-cyan)',
  'var(--color-arcade-yellow)',
  'var(--color-voxel-purple)',
  'var(--color-pixel-pink)',
];

export default function PixelStars({ count = 30, className = '' }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic positions
      const top = ((i * 37 + 13) % 100);
      const left = ((i * 61 + 29) % 100);
      const size = (i % 3) + 2; // 2px, 3px, or 4px
      const color = STAR_COLORS[i % STAR_COLORS.length];
      const duration = 2.5 + (i % 4) * 0.8;
      const delay = (i % 5) * 0.6;
      const opacity = 0.3 + (i % 5) * 0.15;

      return {
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size: `${size}px`,
        color,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
      };
    });
  }, [count]);

  return (
    <div className={`pixel-stars ${className}`} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="pixel-star"
          style={{
            top: star.top,
            left: star.left,
            '--star-size': star.size,
            '--star-color': star.color,
            '--star-duration': star.duration,
            '--star-delay': star.delay,
            '--star-opacity': star.opacity,
          }}
        />
      ))}
    </div>
  );
}
