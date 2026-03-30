import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {getSavedRecipes} from '../api/recipes';

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2d7a4f" />
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No saved recipes yet.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RecipeEntry')}>
          <Text style={styles.link}>Healthify your first recipe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={recipes}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.recipe?.title ?? 'Recipe'}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.badge}>{item.mode}</Text>
            <Text style={styles.intensity}>Intensity {item.sliderIntensity}/5</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24},
  empty: {fontSize: 16, color: '#888', marginBottom: 12},
  link: {color: '#2d7a4f', fontSize: 15, fontWeight: '600'},
  list: {backgroundColor: '#f8faf9'},
  listContent: {padding: 16},
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 4, elevation: 2,
  },
  cardTitle: {fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 8},
  cardMeta: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  badge: {
    backgroundColor: '#e8f5ee', color: '#2d7a4f',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5,
    fontSize: 11, fontWeight: '700',
  },
  intensity: {fontSize: 12, color: '#888'},
});
