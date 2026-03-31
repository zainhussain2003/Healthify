import { colors } from '../theme';

interface Props {
  size?: 'large' | 'medium';
  light?: boolean;
}

function LeafDot({ size, light }: { size: number; light?: boolean }) {
  const fill = light ? '#a8e6c0' : colors.green;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'block' }}>
      <path
        d="M10 18 C10 18 2 12 3 5 C4 1 10 1 10 1 C10 1 16 1 17 5 C18 12 10 18 10 18 Z"
        fill={fill}
      />
      <path d="M10 17 L10 3" stroke="#fff" strokeWidth={1.5} opacity={0.5} />
    </svg>
  );
}

export default function HealthifyWordmark({ size = 'large', light = false }: Props) {
  const fontSize = size === 'large' ? 42 : 28;
  const leafSize = size === 'large' ? 13 : 9;
  const textColor = light ? '#fff' : colors.green;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
      <span style={{ fontFamily: 'Pacifico, cursive', fontSize, color: textColor }}>Health</span>

      {/* "i" with leaf overlaid on the dot */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize, color: textColor }}>i</span>
        <div
          style={{
            position: 'absolute',
            top: size === 'large' ? -2 : -1,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <LeafDot size={leafSize} light={light} />
        </div>
      </div>

      <span style={{ fontFamily: 'Pacifico, cursive', fontSize, color: textColor }}>fy</span>
    </div>
  );
}
