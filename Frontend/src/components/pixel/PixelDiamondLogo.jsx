export default function PixelDiamondLogo({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={`pixel-diamond-logo pixelated ${className}`}
      aria-hidden="true"
    >
      <rect x="14" y="2" width="4" height="4" fill="var(--color-arcade-yellow)" />
      <rect x="10" y="6" width="4" height="4" fill="var(--color-electric-cyan)" />
      <rect x="18" y="6" width="4" height="4" fill="var(--color-electric-cyan)" />
      <rect x="6" y="10" width="4" height="4" fill="var(--color-pixel-blue)" />
      <rect x="22" y="10" width="4" height="4" fill="var(--color-pixel-blue)" />
      <rect x="10" y="10" width="12" height="4" fill="var(--color-cloud-white)" />
      <rect x="6" y="14" width="20" height="4" fill="var(--color-electric-cyan)" />
      <rect x="10" y="18" width="4" height="4" fill="var(--color-voxel-purple)" />
      <rect x="14" y="18" width="4" height="4" fill="var(--color-pixel-blue)" />
      <rect x="18" y="18" width="4" height="4" fill="var(--color-voxel-purple)" />
      <rect x="12" y="22" width="8" height="4" fill="var(--color-voxel-purple)" />
      <rect x="14" y="26" width="4" height="4" fill="var(--color-pixel-pink)" />
    </svg>
  );
}
