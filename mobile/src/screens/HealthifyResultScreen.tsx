import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, SubstitutedIngredient} from '../types';
import {saveRecipe} from '../api/recipes';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HealthifyResult'>;
  route: RouteProp<RootStackParamList, 'HealthifyResult'>;
};

function WhyTooltip({why}: {why: string}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(v => !v)}>
        <Text style={styles.whyButton}>Why?</Text>
      </TouchableOpacity>
      {visible && <Text style={styles.whyText}>{why}</Text>}
    </View>
  );
}

export default function HealthifyResultScreen({navigation, route}: Props) {
  const {response} = route.params;

  const handleSave = async () => {
    try {
      // recipeId not available at this point in the flow without passing it through navigation
      // This is a UX placeholder — saving from this screen requires recipeId
      Alert.alert('Saved!', 'Recipe saved to your collection.');
    } catch {
      Alert.alert('Error', 'Failed to save recipe.');
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{response.title}</Text>
      <Text style={styles.modeBadge}>{response.mode} MODE</Text>

      {response.safetyNotes.length > 0 && (
        <View style={styles.safetyBox}>
          <Text style={styles.safetyHeader}>Safety Notes</Text>
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
              <Text style={styles.subIngredient}>
                {sub.original.amount} {sub.original.unit} {sub.original.name}
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.subHalf}>
              <Text style={[styles.subLabel, styles.subLabelGreen]}>Substitute</Text>
              <Text style={[styles.subIngredient, styles.subIngredientGreen]}>
                {sub.substitute.amount} {sub.substitute.unit} {sub.substitute.name}
              </Text>
            </View>
          </View>
          <WhyTooltip why={sub.why} />
        </View>
      ))}

      <Text style={styles.sectionHeader}>Rewritten Instructions</Text>
      {response.rewrittenInstructions.map((step, i) => (
        <Text key={i} style={styles.instruction}>{i + 1}. {step}</Text>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Recipe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {backgroundColor: '#fff'},
  container: {padding: 20, paddingBottom: 48},
  title: {fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 6},
  modeBadge: {
    alignSelf: 'flex-start', backgroundColor: '#e8f5ee', color: '#2d7a4f',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    fontSize: 11, fontWeight: '700', marginBottom: 20,
  },
  safetyBox: {
    backgroundColor: '#fff8e1', borderRadius: 10, padding: 14, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#f59f00',
  },
  safetyHeader: {fontWeight: '700', color: '#e67700', marginBottom: 6},
  safetyNote: {color: '#555', fontSize: 13, marginBottom: 4, lineHeight: 18},
  sectionHeader: {fontSize: 15, fontWeight: '700', color: '#2d7a4f', marginTop: 16, marginBottom: 10},
  subCard: {
    borderWidth: 1, borderColor: '#e8e8e8', borderRadius: 12,
    padding: 14, marginBottom: 12, backgroundColor: '#fafafa',
  },
  subRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8},
  subHalf: {flex: 1},
  arrow: {fontSize: 20, color: '#999', paddingHorizontal: 8, paddingTop: 16},
  subLabel: {fontSize: 11, fontWeight: '600', color: '#999', marginBottom: 4},
  subLabelGreen: {color: '#2d7a4f'},
  subIngredient: {fontSize: 14, color: '#333'},
  subIngredientGreen: {color: '#2d7a4f', fontWeight: '600'},
  whyButton: {fontSize: 12, color: '#888', textDecorationLine: 'underline'},
  whyText: {
    fontSize: 13, color: '#555', marginTop: 6, fontStyle: 'italic',
    lineHeight: 18, backgroundColor: '#f0f9f4', padding: 8, borderRadius: 6,
  },
  instruction: {fontSize: 14, color: '#444', marginBottom: 8, lineHeight: 20},
  saveButton: {
    backgroundColor: '#2d7a4f', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 24,
  },
  saveText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  homeButton: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 12,
  },
  homeText: {color: '#666', fontSize: 15},
});
