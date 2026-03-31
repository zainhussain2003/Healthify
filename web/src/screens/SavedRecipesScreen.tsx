import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedRecipes } from '../api/recipes';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../theme';

const INTENSITY_LABELS = ['', 'Light Tweaks', 'Moderate', 'Balanced', 'Lean', 'Ultra Lean'];

export default function SavedRecipesScreen() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSavedRecipes()
      .then(setRecipes)
      .catch(() => setError('Failed to load saved recipes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.screen}>
      <ScreenHeader />
      <div style={styles.scroll}>
        {loading ? (
          <div style={styles.center}>
            <div style={styles.spinner} />
          </div>
        ) : error ? (
          <div style={styles.center}>
            <p style={{ color: colors.textMuted }}>{error}</p>
          </div>
        ) : recipes.length === 0 ? (
          <div style={styles.center}>
            <span style={styles.emptyIcon}>🥗</span>
            <p style={styles.emptyTitle}>No saved recipes yet</p>
            <button
              style={styles.ctaButton}
              onClick={() => navigate('/recipe-entry')}
            >
              Healthify your first recipe
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {recipes.map((item: any) => (
              <div key={item.id} style={styles.card}>
                <p style={styles.cardTitle}>{item.recipe?.title ?? 'Saved Recipe'}</p>
                <div style={styles.cardMeta}>
                  <div style={styles.badge}>
                    <span style={styles.badgeText}>
                      {item.mode === 'BAKING' ? 'Baking Mode' : 'Cooking Mode'}
                    </span>
                  </div>
                  <span style={styles.intensity}>
                    {INTENSITY_LABELS[item.sliderIntensity] ?? `${item.sliderIntensity}/5`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    backgroundColor: colors.offWhite,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 480,
    margin: '0 auto',
  },
  scroll: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 300,
  },
  spinner: {
    width: 40,
    height: 40,
    border: `4px solid ${colors.greenLight}`,
    borderTop: `4px solid ${colors.green}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    color: colors.textMuted,
    marginBottom: 20,
    fontWeight: 500,
  },
  ctaButton: {
    backgroundColor: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '13px 24px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: `1px solid ${colors.border}`,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 10,
  },
  cardMeta: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.greenLight,
    padding: '3px 8px',
    borderRadius: 6,
  },
  badgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: 700,
  },
  intensity: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: 500,
  },
};
