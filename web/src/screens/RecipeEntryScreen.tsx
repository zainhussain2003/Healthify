import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseRecipe } from '../api/recipes';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../theme';

export default function RecipeEntryScreen() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!text.trim()) {
      setError('Please paste or type a recipe');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const parsed = await parseRecipe(title.trim() || null, text);
      navigate('/recipe-result', { state: { recipe: parsed } });
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to parse recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      <ScreenHeader />
      <div style={styles.scroll}>
        <h2 style={styles.heading}>Paste Your Recipe</h2>
        <p style={styles.hint}>
          Include ingredient amounts and instructions. Headers like "Ingredients:" and "Instructions:" help accuracy.
        </p>

        {error ? <p style={styles.error}>{error}</p> : null}

        <input
          style={styles.titleInput}
          type="text"
          placeholder="Recipe title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          style={styles.textArea}
          placeholder="Paste your full recipe here..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={12}
        />

        <button style={styles.primaryButton} onClick={handleParse} disabled={loading}>
          {loading ? 'Parsing…' : 'Parse Recipe →'}
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
    padding: 24,
    paddingBottom: 48,
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 24,
    lineHeight: 1.6,
  },
  error: {
    fontSize: 13,
    color: '#c0392b',
    backgroundColor: '#fff5f4',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 12,
  },
  titleInput: {
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
  textArea: {
    width: '100%',
    border: `1.5px solid ${colors.border}`,
    borderRadius: 12,
    padding: '13px 14px',
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.offWhite,
    outline: 'none',
    marginBottom: 24,
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: 220,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '16px 0',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
