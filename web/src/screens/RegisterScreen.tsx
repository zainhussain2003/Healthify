import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import HealthifyLogo from '../components/HealthifyLogo';
import HealthifyWordmark from '../components/HealthifyWordmark';
import { colors } from '../theme';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await register(email.trim(), password);
      localStorage.setItem('jwt_token', res.token);
      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <HealthifyLogo size={80} />
          <div style={{ marginTop: 10, marginBottom: 4 }}>
            <HealthifyWordmark size="medium" />
          </div>
        </div>

        <h2 style={styles.heading}>Create your account</h2>

        {error ? <p style={styles.error}>{error}</p> : null}

        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRegister()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRegister()}
        />

        <button style={styles.primaryButton} onClick={handleRegister} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <button style={styles.secondaryButton} onClick={() => navigate('/login')}>
          Already have an account? Sign in
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
    padding: 24,
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
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    color: '#c0392b',
    backgroundColor: '#fff5f4',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    border: `1.5px solid ${colors.border}`,
    borderRadius: 12,
    padding: '13px 14px',
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.offWhite,
    outline: 'none',
    marginBottom: 12,
    fontFamily: 'inherit',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '15px 0',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 12,
    fontFamily: 'inherit',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    color: colors.green,
    border: `2px solid ${colors.green}`,
    borderRadius: 12,
    padding: '14px 0',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
