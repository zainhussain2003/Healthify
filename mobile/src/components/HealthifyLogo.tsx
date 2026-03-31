import React from 'react';
import Svg, {
  Path, Circle, Ellipse, G, ClipPath, Defs,
} from 'react-native-svg';

interface Props {
  size?: number;
}

/**
 * Healthify logo — green plant leaves + lime/citrus half-slice.
 * Inspired by the brand mockup.
 */
export default function HealthifyLogo({size = 100}: Props) {
  const s = size / 100;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Citrus half-slice base */}
      <Path
        d="M20 62 Q50 82 80 62 L80 62 Q80 90 50 90 Q20 90 20 62 Z"
        fill="#a8d5a2"
        opacity={0.9}
      />
      {/* Citrus inner segments */}
      <Path
        d="M50 66 L50 88"
        stroke="#2d7a4f"
        strokeWidth={1.5}
        opacity={0.5}
      />
      <Path
        d="M50 66 L30 78"
        stroke="#2d7a4f"
        strokeWidth={1.5}
        opacity={0.5}
      />
      <Path
        d="M50 66 L70 78"
        stroke="#2d7a4f"
        strokeWidth={1.5}
        opacity={0.5}
      />
      <Circle cx={50} cy={66} r={3} fill="#2d7a4f" opacity={0.4} />

      {/* Main large leaf — center */}
      <Path
        d="M50 58 C50 58 30 40 34 18 C38 10 50 8 50 8 C50 8 62 10 66 18 C70 40 50 58 50 58 Z"
        fill="#2d7a4f"
      />
      {/* Leaf vein */}
      <Path
        d="M50 55 L50 14"
        stroke="#fff"
        strokeWidth={1.2}
        opacity={0.4}
      />

      {/* Left leaf */}
      <Path
        d="M42 50 C42 50 22 40 20 22 C19 14 28 10 28 10 C28 10 38 14 40 28 C42 42 42 50 42 50 Z"
        fill="#3a9b63"
      />
      <Path
        d="M41 48 L24 16"
        stroke="#fff"
        strokeWidth={1}
        opacity={0.35}
      />

      {/* Right leaf */}
      <Path
        d="M58 50 C58 50 78 40 80 22 C81 14 72 10 72 10 C72 10 62 14 60 28 C58 42 58 50 58 50 Z"
        fill="#3a9b63"
      />
      <Path
        d="M59 48 L76 16"
        stroke="#fff"
        strokeWidth={1}
        opacity={0.35}
      />
    </Svg>
  );
}
