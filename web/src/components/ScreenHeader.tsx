import { useNavigate } from 'react-router-dom';
import HealthifyWordmark from './HealthifyWordmark';
import { colors } from '../theme';

interface Props {
  onBack?: () => void;
  showBack?: boolean;
}

export default function ScreenHeader({ onBack, showBack = true }: Props) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div
      style={{
        backgroundColor: colors.greenDark,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {showBack && (
        <button
          onClick={handleBack}
          style={{
            position: 'absolute',
            left: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 22,
            padding: '4px 8px',
            lineHeight: 1,
          }}
        >
          ←
        </button>
      )}
      <HealthifyWordmark size="medium" light />
    </div>
  );
}
