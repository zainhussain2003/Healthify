import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveRecipe } from '../api/recipes';
import ScreenHeader from '../components/ScreenHeader';
import { HealthifyResponse, SubstitutedIngredient } from '../types';
import { colors } from '../theme';

function WhyTooltip({ why }: { why: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button
        onClick={() => setVisible(v => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          color: colors.green,
          fontWeight: 600,
          padding: 0,
          fontFamily: 'inherit',
        }}
      >
        {visible ? 'Hide ▲' : 'Why? ▼'}
      </button>
      {visible && (
        <p
          style={{
            fontSize: 13,
            color: '#444',
            marginTop: 8,
            lineHeight: 1.6,
            fontStyle: 'italic',
            backgroundColor: colors.greenLight,
            padding: 10,
            borderRadius: 8,
          }}
        >
          {why}
        </p>
      )}
    </div>
  );
}

export default function HealthifyResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { response, recipeId, sliderIntensity, mode } = location.state ?? {};

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!response) {
    navigate('/home');
    return null;
  }

  const res: HealthifyResponse = response;
  const modeLabel = mode === 'BAKING' ? 'Baking Mode' : 'Cooking Mode';

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    setError('');
    try {
      await saveRecipe(recipeId, res, sliderIntensity, mode);
      setSaved(true);
    } catch {
      setError('Failed to save recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.screen}>
      <ScreenHeader />
      <div style={styles.scroll}>
        <h2 style={styles.recipeTitle}>{res.title}</h2>

        <div style={styles.modeBadge}>
          <span style={styles.modeBadgeText}>{modeLabel.toUpperCase()}</span>
        </div>

        {res.safetyNotes.length > 0 && (
          <div style={styles.safetyBox}>
            <p style={styles.safetyHeader}>⚠ Safety Notes</p>
            {res.safetyNotes.map((note, i) => (
              <p key={i} style={styles.safetyNote}>• {note}</p>
            ))}
          </div>
        )}

        <p style={styles.sectionHeader}>
          Substitutions ({res.substitutedIngredients.length})
        </p>
        {res.substitutedIngredients.map((sub: SubstitutedIngredient, i: number) => (
          <div key={i} style={styles.subCard}>
            <div style={styles.subRow}>
              <div style={styles.subHalf}>
                <p style={styles.subLabel}>Original</p>
                <p style={styles.subValue}>
                  {sub.original.amount} {sub.original.unit} {sub.original.name}
                </p>
              </div>
              <span style={styles.arrow}>→</span>
              <div style={styles.subHalf}>
                <p style={{ ...styles.subLabel, color: colors.green }}>Substitute</p>
                <p style={{ ...styles.subValue, color: colors.greenDark, fontWeight: 600 }}>
                  {sub.substitute.amount} {sub.substitute.unit} {sub.substitute.name}
                </p>
              </div>
            </div>
            <WhyTooltip why={sub.why} />
          </div>
        ))}

        <p style={styles.sectionHeader}>Rewritten Instructions</p>
        <div style={styles.instructionsCard}>
          {res.rewrittenInstructions.map((step, i) => (
            <p key={i} style={styles.instruction}>{i + 1}. {step}</p>
          ))}
        </div>

        {error ? <p style={styles.errorText}>{error}</p> : null}

        <button
          style={{
            ...styles.primaryButton,
            backgroundColor: saved ? '#5a9e76' : colors.green,
          }}
          onClick={handleSave}
          disabled={saving || saved}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Recipe'}
        </button>

        <button style={styles.secondaryButton} onClick={() => navigate('/home')}>
          Back to Home
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
    backgroundColor: colors.greenMint,
    padding: 20,
    paddingBottom: 48,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 10,
  },
  modeBadge: {
    display: 'inline-block',
    backgroundColor: colors.greenLight,
    borderRadius: 6,
    padding: '4px 10px',
    marginBottom: 20,
  },
  modeBadgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.8px',
  },
  safetyBox: {
    backgroundColor: '#fff5f4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeft: '4px solid #e05c3a',
  },
  safetyHeader: {
    fontWeight: 700,
    color: '#c0392b',
    marginBottom: 8,
    fontSize: 14,
  },
  safetyNote: {
    color: '#555',
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 1.5,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.green,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginTop: 4,
    marginBottom: 10,
  },
  subCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    padding: 14,
    marginBottom: 10,
  },
  subRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subHalf: {
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: colors.textLight,
    padding: '14px 8px 0',
  },
  subLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.textLight,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  subValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  instructionsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    padding: 14,
    marginBottom: 24,
  },
  instruction: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 1.6,
  },
  errorText: {
    fontSize: 13,
    color: '#c0392b',
    backgroundColor: '#fff5f4',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 12,
  },
  primaryButton: {
    width: '100%',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 12,
    fontFamily: 'inherit',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: colors.white,
    color: colors.green,
    border: `2px solid ${colors.green}`,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
