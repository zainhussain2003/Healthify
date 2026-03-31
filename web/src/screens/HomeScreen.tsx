import { useNavigate } from 'react-router-dom';
import HealthifyLogo from '../components/HealthifyLogo';
import HealthifyWordmark from '../components/HealthifyWordmark';
import { colors } from '../theme';

export default function HomeScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <HealthifyLogo size={110} />
          <div style={{ marginTop: 12, marginBottom: 10 }}>
            <HealthifyWordmark size="large" />
          </div>
          <p style={styles.subtitle}>What would you like to do?</p>
        </div>

        <div style={styles.buttons}>
          <button style={styles.primaryButton} onClick={() => navigate('/recipe-entry')}>
            <span style={styles.primaryButtonText}>Healthify a Recipe</span>
            <span style={styles.primaryButtonSub}>Paste or type any recipe</span>
          </button>

          <button style={styles.secondaryButton} onClick={() => navigate('/saved-recipes')}>
            My Saved Recipes
          </button>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 44,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  primaryButton: {
    backgroundColor: colors.green,
    border: 'none',
    borderRadius: 14,
    padding: 20,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    fontFamily: 'inherit',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
  },
  primaryButtonSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    border: `2px solid ${colors.green}`,
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    fontWeight: 600,
    color: colors.green,
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.textLight,
    fontSize: 14,
    marginTop: 36,
    alignSelf: 'center',
    fontFamily: 'inherit',
  },
};
