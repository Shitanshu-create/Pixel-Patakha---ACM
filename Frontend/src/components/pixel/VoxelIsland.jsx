export default function VoxelIsland({ size = 280, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={`voxel-island pixelated ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Top stepped surface - Electric Cyan & Pixel Blue */}
      <rect x="50" y="25" width="100" height="15" fill="var(--color-electric-cyan)" />
      <rect x="40" y="40" width="120" height="15" fill="var(--color-pixel-blue)" />
      <rect x="30" y="55" width="140" height="20" fill="var(--color-voxel-purple)" />

      {/* Surface pixel details (arcade yellow / cloud white crystals) */}
      <rect x="70" y="15" width="10" height="10" fill="var(--color-arcade-yellow)" />
      <rect x="75" y="10" width="5" height="5" fill="var(--color-cloud-white)" />
      <rect x="115" y="18" width="8" height="8" fill="var(--color-arcade-yellow)" />
      <rect x="130" y="32" width="6" height="6" fill="var(--color-cloud-white)" />

      {/* Stepped Cliff / Underbelly - Deep Navy & Panel Border */}
      <rect x="40" y="75" width="120" height="18" fill="var(--color-deep-navy)" />
      <rect x="55" y="93" width="90" height="16" fill="var(--color-panel-border)" />
      <rect x="75" y="109" width="50" height="14" fill="var(--color-deep-navy)" />
      <rect x="90" y="123" width="20" height="12" fill="var(--color-panel-border)" />

      {/* Floating mini blocks beneath island */}
      <rect x="45" y="115" width="8" height="8" fill="var(--color-voxel-purple)" />
      <rect x="140" y="105" width="10" height="10" fill="var(--color-pixel-blue)" />
      <rect x="155" y="125" width="6" height="6" fill="var(--color-electric-cyan)" />
    </svg>
  );
}
