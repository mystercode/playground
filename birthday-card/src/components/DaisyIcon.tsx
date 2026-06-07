interface DaisyIconProps {
  size?: number;
  className?: string;
  petalFill?: string;
  petalStroke?: string;
  centerFill?: string;
  centerInner?: string;
}

const PETALS = 12;

export default function DaisyIcon({
  size = 80,
  className,
  petalFill   = '#F8F8F0',
  petalStroke = '#E0D8C8',
  centerFill  = '#F5D16A',
  centerInner = '#E8B84B',
}: DaisyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-40 -40 80 80"
      aria-hidden="true"
      className={className}
      style={{ display: 'block' }}
    >
      {Array.from({ length: PETALS }, (_, i) => (
        <g key={i} transform={`rotate(${(i / PETALS) * 360})`}>
          <ellipse
            cx={0} cy={-26}
            rx={4.5} ry={13}
            fill={petalFill}
            stroke={petalStroke}
            strokeWidth={0.6}
          />
        </g>
      ))}
      <circle cx={0} cy={0} r={11} fill={centerFill} />
      <circle cx={0} cy={0} r={7}  fill={centerInner} />
    </svg>
  );
}
