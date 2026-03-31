import { colors } from '../theme';

interface Props {
  size?: 'large' | 'medium';
  light?: boolean;
}

function LeafDot({ pxSize, light }: { pxSize: number; light?: boolean }) {
  const fill = light ? '#a8e6c0' : colors.green;
  return (
    <svg width={pxSize} height={pxSize} viewBox="0 0 20 20" style={{ display: 'block' }}>
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
  const leafPx = size === 'large' ? 16 : 11;
  const textColor = light ? '#fff' : colors.green;
  // Background behind the leaf must match the parent bg so the original i-dot is hidden
  const coverBg = light ? colors.greenDark : '#ffffff';
  // How far from the top of the "i" element the dot sits (tuned for Pacifico in browsers)
  const dotTop = size === 'large' ? 7 : 5;
  // Width of the cover rectangle — slightly wider than the leaf
  const coverW = leafPx + 6;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
      <span style={{ fontFamily: 'Pacifico, cursive', fontSize, color: textColor }}>
        Health
      </span>

      {/* "i" — original dot is hidden by the cover, replaced by the leaf */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize, color: textColor }}>i</span>

        {/* Cover the original font dot */}
        <div
          style={{
            position: 'absolute',
            top: dotTop,
            left: '50%',
            transform: 'translateX(-50%)',
            width: coverW,
            height: leafPx + 4,
            backgroundColor: coverBg,
            zIndex: 1,
          }}
        />

        {/* Leaf replaces the dot */}
        <div
          style={{
            position: 'absolute',
            top: dotTop,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <LeafDot pxSize={leafPx} light={light} />
        </div>
      </div>

      <span style={{ fontFamily: 'Pacifico, cursive', fontSize, color: textColor }}>fy</span>
    </div>
  );
}
