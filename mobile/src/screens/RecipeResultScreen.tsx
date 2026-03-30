import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import {healthify} from '../api/recipes';

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
      navigation.navigate('HealthifyResult', {response});
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.sectionHeader}>Ingredients ({recipe.ingredients.length})</Text>
      {recipe.ingredients.map((ing, i) => (
        <Text key={i} style={styles.ingredient}>
          • {ing.amount} {ing.unit} {ing.name}
        </Text>
      ))}

      <Text style={styles.sectionHeader}>Instructions</Text>
      {recipe.instructions.map((step, i) => (
        <Text key={i} style={styles.instruction}>{i + 1}. {step}</Text>
      ))}

      <View style={styles.divider} />

      <Text style={styles.sectionHeader}>Healthify Settings</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Baking Mode</Text>
        <Switch
          value={isBaking}
          onValueChange={setIsBaking}
          trackColor={{true: '#2d7a4f'}}
        />
      </View>
      {isBaking && (
        <Text style={styles.bakingNote}>
          Uses a safe, chemically-vetted substitution database. No AI.
        </Text>
      )}

      <Text style={styles.intensityLabel}>
        Intensity: {intensity}/5 — {INTENSITY_LABELS[intensity]}
      </Text>
      <View style={styles.sliderRow}>
        {[1, 2, 3, 4, 5].map(n => (
          <TouchableOpacity
            key={n}
            style={[styles.dot, intensity === n && styles.dotActive]}
            onPress={() => setIntensity(n)}>
            <Text style={[styles.dotText, intensity === n && styles.dotTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.healthifyButton} onPress={handleHealthify} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.healthifyText}>Healthify This Recipe</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {backgroundColor: '#fff'},
  container: {padding: 20, paddingBottom: 48},
  title: {fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 20},
  sectionHeader: {fontSize: 15, fontWeight: '700', color: '#2d7a4f', marginTop: 16, marginBottom: 8},
  ingredient: {fontSize: 14, color: '#444', marginBottom: 4, paddingLeft: 8},
  instruction: {fontSize: 14, color: '#444', marginBottom: 8, lineHeight: 20},
  divider: {height: 1, backgroundColor: '#eee', marginVertical: 20},
  toggleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  toggleLabel: {fontSize: 15, fontWeight: '600', color: '#333'},
  bakingNote: {fontSize: 12, color: '#888', marginBottom: 12, fontStyle: 'italic'},
  intensityLabel: {fontSize: 14, color: '#444', marginTop: 16, marginBottom: 10},
  sliderRow: {flexDirection: 'row', gap: 10, marginBottom: 28},
  dot: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    borderColor: '#2d7a4f', justifyContent: 'center', alignItems: 'center',
  },
  dotActive: {backgroundColor: '#2d7a4f'},
  dotText: {color: '#2d7a4f', fontWeight: '700'},
  dotTextActive: {color: '#fff'},
  healthifyButton: {
    backgroundColor: '#2d7a4f', borderRadius: 14, padding: 18, alignItems: 'center',
  },
  healthifyText: {color: '#fff', fontSize: 17, fontWeight: '700'},
});
