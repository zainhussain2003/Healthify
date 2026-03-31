import React, {useState} from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Switch,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import {healthify} from '../api/recipes';
import {colors} from '../theme';
import ScreenHeader from '../components/ScreenHeader';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RecipeResult'>;
  route: RouteProp<RootStackParamList, 'RecipeResult'>;
};

const INTENSITY_LABELS = ['', 'Light Tweaks', 'Moderate', 'Balanced', 'Lean', 'Ultra Lean'];

export default function RecipeResultScreen({navigation, route}: Props) {
  const {recipe} = route.params;
  const [intensity, setIntensity] = useState(3);
  const [isBaking, setIsBaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHealthify = async () => {
    setLoading(true);
    try {
      const mode = isBaking ? 'BAKING' : 'COOKING';
      const response = await healthify(recipe, intensity, mode);
      navigation.navigate('HealthifyResult', {response, recipeId: recipe.recipeId, sliderIntensity: intensity, mode});
    } catch (err: any) {
      const msg = err.response?.data?.error ?? err.response?.data?.message ?? 'Something went wrong. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>

        <Text style={styles.sectionHeader}>Ingredients ({recipe.ingredients.length})</Text>
        <View style={styles.card}>
          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={styles.ingredient}>
              • {ing.amount} {ing.unit} {ing.name}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Instructions</Text>
        <View style={styles.card}>
          {recipe.instructions.map((step, i) => (
            <Text key={i} style={styles.instruction}>{i + 1}. {step}</Text>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionHeader}>Healthify Settings</Text>

        <View style={styles.settingsCard}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Baking Mode (cakes & bread)</Text>
              <Text style={styles.toggleSub}>
                {isBaking ? 'Safe, vetted substitution database — no AI' : 'AI-powered substitution'}
              </Text>
            </View>
            <Switch
              value={isBaking}
              onValueChange={setIsBaking}
              trackColor={{true: colors.green, false: colors.border}}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.intensityLabel}>
            Intensity: {intensity}/5 — <Text style={styles.intensityName}>{INTENSITY_LABELS[intensity]}</Text>
          </Text>
          <View style={styles.dotsRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.dot, intensity === n && styles.dotActive]}
                onPress={() => setIntensity(n)}>
                <Text style={[styles.dotText, intensity === n && styles.dotTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleHealthify} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryButtonText}>Healthify This Recipe</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.white},
  scroll: {flex: 1},
  container: {padding: 20, paddingBottom: 48},
  recipeTitle: {fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 20},
  sectionHeader: {fontSize: 13, fontWeight: '700', color: colors.green, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 4},
  card: {
    backgroundColor: colors.offWhite, borderRadius: 12,
    padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  ingredient: {fontSize: 14, color: colors.text, marginBottom: 5},
  instruction: {fontSize: 14, color: colors.text, marginBottom: 8, lineHeight: 20},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: 16},
  settingsCard: {
    backgroundColor: colors.offWhite, borderRadius: 14,
    padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.border,
  },
  toggleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  toggleLabel: {fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2},
  toggleSub: {fontSize: 12, color: colors.textMuted},
  intensityLabel: {fontSize: 14, color: colors.text, marginBottom: 12},
  intensityName: {fontWeight: '600', color: colors.green},
  dotsRow: {flexDirection: 'row', gap: 10},
  dot: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    borderColor: colors.green, justifyContent: 'center', alignItems: 'center',
  },
  dotActive: {backgroundColor: colors.green},
  dotText: {color: colors.green, fontWeight: '700'},
  dotTextActive: {color: '#fff'},
  primaryButton: {
    backgroundColor: colors.green, borderRadius: 14,
    padding: 18, alignItems: 'center',
  },
  primaryButtonText: {color: '#fff', fontSize: 17, fontWeight: '700'},
});
