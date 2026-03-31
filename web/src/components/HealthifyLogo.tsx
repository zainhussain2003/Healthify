interface Props {
  size?: number;
}

export default function HealthifyLogo({ size = 100 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Rounded green background */}
      <rect x="0" y="0" width="100" height="100" rx="22" fill="#2d7a4f" />

      {/* Stem */}
      <line x1="50" y1="80" x2="50" y2="54" stroke="white" strokeWidth="4" strokeLinecap="round" />

      {/* Main centre leaf */}
      <path
        d="M50 54 C50 54 34 43 35 24 C41 17 59 17 65 24 C66 43 50 54 50 54 Z"
        fill="white"
      />
      {/* Centre leaf vein */}
      <path d="M50 52 L50 26" stroke="#2d7a4f" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

      {/* Left small leaf */}
      <path
        d="M50 64 C50 64 30 59 27 47 C35 43 50 64 50 64 Z"
        fill="rgba(255,255,255,0.85)"
      />

      {/* Right small leaf */}
      <path
        d="M50 64 C50 64 70 59 73 47 C65 43 50 64 50 64 Z"
        fill="rgba(255,255,255,0.85)"
      />
    </svg>
  );
}
