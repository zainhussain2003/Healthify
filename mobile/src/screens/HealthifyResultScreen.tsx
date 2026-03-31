import React, {useState} from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, SubstitutedIngredient} from '../types';
import {saveRecipe} from '../api/recipes';
import {colors} from '../theme';
import ScreenHeader from '../components/ScreenHeader';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HealthifyResult'>;
  route: RouteProp<RootStackParamList, 'HealthifyResult'>;
};

function WhyTooltip({why}: {why: string}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(v => !v)} hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
        <Text style={styles.whyButton}>{visible ? 'Hide ▲' : 'Why? ▼'}</Text>
      </TouchableOpacity>
      {visible && <Text style={styles.whyText}>{why}</Text>}
    </View>
  );
}

export default function HealthifyResultScreen({navigation, route}: Props) {
  const {response, recipeId, sliderIntensity, mode} = route.params;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    try {
      await saveRecipe(recipeId, response, sliderIntensity, mode);
      setSaved(true);
      Alert.alert('Saved!', 'Recipe saved to your collection.');
    } catch {
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const modeLabel = mode === 'BAKING' ? 'Baking Mode' : 'Cooking Mode';

  return (
    <View style={styles.screen}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

        <Text style={styles.recipeTitle}>{response.title}</Text>
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>{modeLabel.toUpperCase()}</Text>
        </View>

        {response.safetyNotes.length > 0 && (
          <View style={styles.safetyBox}>
            <Text style={styles.safetyHeader}>⚠ Safety Notes</Text>
            {response.safetyNotes.map((note, i) => (
              <Text key={i} style={styles.safetyNote}>• {note}</Text>
            ))}
          </View>
        )}

        <Text style={styles.sectionHeader}>
          Substitutions ({response.substitutedIngredients.length})
        </Text>
        {response.substitutedIngredients.map((sub: SubstitutedIngredient, i: number) => (
          <View key={i} style={styles.subCard}>
            <View style={styles.subRow}>
              <View style={styles.subHalf}>
                <Text style={styles.subLabel}>Original</Text>
                <Text style={styles.subValue}>
                  {sub.original.amount} {sub.original.unit} {sub.original.name}
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.subHalf}>
                <Text style={[styles.subLabel, styles.subLabelGreen]}>Substitute</Text>
                <Text style={[styles.subValue, styles.subValueGreen]}>
                  {sub.substitute.amount} {sub.substitute.unit} {sub.substitute.name}
                </Text>
              </View>
            </View>
            <WhyTooltip why={sub.why} />
          </View>
        ))}

        <Text style={styles.sectionHeader}>Rewritten Instructions</Text>
        <View style={styles.instructionsCard}>
          {response.rewrittenInstructions.map((step, i) => (
            <Text key={i} style={styles.instruction}>{i + 1}. {step}</Text>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, saved && styles.primaryButtonSaved]}
          onPress={handleSave}
          disabled={saving || saved}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryButtonText}>{saved ? '✓ Saved!' : 'Save Recipe'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.white},
  scroll: {flex: 1, backgroundColor: colors.greenMint},
  container: {padding: 20, paddingBottom: 48},

  recipeTitle: {fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10},
  modeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.greenLight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 20,
  },
  modeBadgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  safetyBox: {
    backgroundColor: '#fff5f4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#e05c3a',
  },
  safetyHeader: {fontWeight: '700', color: '#c0392b', marginBottom: 8, fontSize: 14},
  safetyNote: {color: '#555', fontSize: 13, marginBottom: 4, lineHeight: 19},

  sectionHeader: {
    fontSize: 13, fontWeight: '700', color: colors.green,
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginTop: 4, marginBottom: 10,
  },

  subCard: {
    backgroundColor: colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 10,
  },
  subRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10},
  subHalf: {flex: 1},
  arrow: {fontSize: 18, color: colors.textLight, paddingHorizontal: 8, paddingTop: 14},
  subLabel: {fontSize: 10, fontWeight: '700', color: colors.textLight, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5},
  subLabelGreen: {color: colors.green},
  subValue: {fontSize: 14, color: colors.text, fontWeight: '500'},
  subValueGreen: {color: colors.greenDark, fontWeight: '600'},
  whyButton: {fontSize: 12, color: colors.green, fontWeight: '600'},
  whyText: {
    fontSize: 13, color: '#444', marginTop: 8,
    lineHeight: 19, fontStyle: 'italic',
    backgroundColor: colors.greenLight,
    padding: 10, borderRadius: 8,
  },

  instructionsCard: {
    backgroundColor: colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 24,
  },
  instruction: {fontSize: 14, color: colors.text, marginBottom: 10, lineHeight: 21},

  primaryButton: {
    backgroundColor: colors.green, borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 12,
  },
  primaryButtonSaved: {backgroundColor: '#5a9e76'},
  primaryButtonText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  secondaryButton: {
    borderWidth: 2, borderColor: colors.green,
    borderRadius: 12, padding: 15, alignItems: 'center',
    backgroundColor: colors.white,
  },
  secondaryButtonText: {color: colors.green, fontSize: 15, fontWeight: '600'},
});
