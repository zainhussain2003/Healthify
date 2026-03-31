import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { healthify } from '../api/recipes';
import ScreenHeader from '../components/ScreenHeader';
import { ParsedRecipe } from '../types';
import { colors } from '../theme';

const INTENSITY_LABELS = ['', 'Light Tweaks', 'Moderate', 'Balanced', 'Lean', 'Ultra Lean'];

export default function RecipeResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe: ParsedRecipe = location.state?.recipe;

  const [intensity, setIntensity] = useState(3);
  const [isBaking, setIsBaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!recipe) {
    navigate('/recipe-entry');
    return null;
  }

  const handleHealthify = async () => {
    setLoading(true);
    setError('');
    try {
      const mode = isBaking ? 'BAKING' : 'COOKING';
      const response = await healthify(recipe, intensity, mode);
      navigate('/healthify-result', {
        state: { response, recipeId: recipe.recipeId, sliderIntensity: intensity, mode },
      });
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      <ScreenHeader />
      <div style={styles.scroll}>
        <h2 style={styles.recipeTitle}>{recipe.title}</h2>

        <p style={styles.sectionHeader}>Ingredients ({recipe.ingredients.length})</p>
        <div style={styles.card}>
          {recipe.ingredients.map((ing, i) => (
            <p key={i} style={styles.ingredient}>
              • {ing.amount} {ing.unit} {ing.name}
            </p>
          ))}
        </div>

        <p style={styles.sectionHeader}>Instructions</p>
        <div style={styles.card}>
          {recipe.instructions.map((step, i) => (
            <p key={i} style={styles.instruction}>{i + 1}. {step}</p>
          ))}
        </div>

        <div style={styles.divider} />
        <p style={styles.sectionHeader}>Healthify Settings</p>

        <div style={styles.settingsCard}>
          <div style={styles.toggleRow}>
            <div>
              <p style={styles.toggleLabel}>Baking Mode (cakes &amp; bread)</p>
              <p style={styles.toggleSub}>
                {isBaking ? 'Safe, vetted substitution database — no AI' : 'AI-powered substitution'}
              </p>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={isBaking}
                onChange={e => setIsBaking(e.target.checked)}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  ...styles.switchTrack,
                  backgroundColor: isBaking ? colors.green : colors.border,
                }}
              >
                <span
                  style={{
                    ...styles.switchThumb,
                    transform: isBaking ? 'translateX(22px)' : 'translateX(2px)',
                  }}
                />
              </span>
            </label>
          </div>

          <div style={styles.divider} />

          <p style={styles.intensityLabel}>
            Intensity: {intensity}/5 —{' '}
            <span style={{ fontWeight: 600, color: colors.green }}>{INTENSITY_LABELS[intensity]}</span>
          </p>
          <div style={styles.dotsRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setIntensity(n)}
                style={{
                  ...styles.dot,
                  backgroundColor: intensity === n ? colors.green : 'transparent',
                  color: intensity === n ? '#fff' : colors.green,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error ? <p style={styles.error}>{error}</p> : null}

        <button style={styles.primaryButton} onClick={handleHealthify} disabled={loading}>
          {loading ? 'Healthifying…' : 'Healthify This Recipe'}
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
    flexDirection: 'column',
    maxWidth: 480,
    margin: '0 auto',
  },
  scroll: {
    flex: 1,
    padding: 20,
    paddingBottom: 48,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.green,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.offWhite,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    border: `1px solid ${colors.border}`,
  },
  ingredient: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  instruction: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    margin: '16px 0',
  },
  settingsCard: {
    backgroundColor: colors.offWhite,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    border: `1px solid ${colors.border}`,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  switch: {
    cursor: 'pointer',
    flexShrink: 0,
    marginLeft: 12,
  },
  switchTrack: {
    display: 'block',
    width: 46,
    height: 26,
    borderRadius: 13,
    position: 'relative' as const,
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  switchThumb: {
    position: 'absolute' as const,
    top: 3,
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  intensityLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  dotsRow: {
    display: 'flex',
    gap: 10,
  },
  dot: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: `2px solid ${colors.green}`,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 15,
    fontFamily: 'inherit',
    transition: 'background-color 0.15s, color 0.15s',
  },
  error: {
    fontSize: 13,
    color: '#c0392b',
    backgroundColor: '#fff5f4',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    padding: 18,
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
