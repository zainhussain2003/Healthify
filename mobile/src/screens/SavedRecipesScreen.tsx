import React, {useEffect, useState} from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, Alert, TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {getSavedRecipes} from '../api/recipes';
import {colors} from '../theme';
import ScreenHeader from '../components/ScreenHeader';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SavedRecipes'>;
};

export default function SavedRecipesScreen({navigation}: Props) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedRecipes()
      .then(setRecipes)
      .catch(() => Alert.alert('Error', 'Failed to load saved recipes'))
      .finally(() => setLoading(false));
  }, []);

  const intensityLabel = (n: number) =>
    ['', 'Light Tweaks', 'Moderate', 'Balanced', 'Lean', 'Ultra Lean'][n] ?? `${n}/5`;

  return (
    <View style={styles.screen}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      ) : recipes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🥗</Text>
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('RecipeEntry')}>
            <Text style={styles.ctaText}>Healthify your first recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={recipes}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.recipe?.title ?? 'Saved Recipe'}</Text>
              <View style={styles.cardMeta}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.mode === 'BAKING' ? 'Baking Mode' : 'Cooking Mode'}
                  </Text>
                </View>
                <Text style={styles.intensity}>{intensityLabel(item.sliderIntensity)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.offWhite},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24},
  emptyIcon: {fontSize: 48, marginBottom: 12},
  emptyTitle: {fontSize: 17, color: colors.textMuted, marginBottom: 20, fontWeight: '500'},
  ctaButton: {
    backgroundColor: colors.green, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 13,
  },
  ctaText: {color: '#fff', fontSize: 15, fontWeight: '700'},
  list: {flex: 1},
  listContent: {padding: 16, paddingBottom: 32},
  card: {
    backgroundColor: colors.white, borderRadius: 14, padding: 16,
    marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: colors.border,
  },
  cardTitle: {fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 10},
  cardMeta: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  badge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  badgeText: {color: colors.green, fontSize: 11, fontWeight: '700'},
  intensity: {fontSize: 12, color: colors.textMuted, fontWeight: '500'},
});
