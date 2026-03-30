import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {parseRecipe} from '../api/recipes';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RecipeEntry'>;
};

export default function RecipeEntryScreen({navigation}: Props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please paste or type a recipe');
      return;
    }
    setLoading(true);
    try {
      const parsed = await parseRecipe(title.trim() || null, text);
      navigation.navigate('RecipeResult', {recipe: parsed});
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message ?? 'Failed to parse recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Paste Your Recipe</Text>
      <Text style={styles.hint}>
        Include ingredient amounts and instructions. Headers like "Ingredients:" and "Instructions:" help accuracy.
      </Text>

      <TextInput
        style={styles.titleInput}
        placeholder="Recipe title (optional)"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Paste your full recipe here..."
        multiline
        numberOfLines={12}
        textAlignVertical="top"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={handleParse} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Parse Recipe →</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {backgroundColor: '#fff'},
  container: {padding: 24, paddingBottom: 48},
  heading: {fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 8},
  hint: {fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 20},
  titleInput: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12,
    fontSize: 16, marginBottom: 12,
  },
  textArea: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12,
    fontSize: 15, minHeight: 220, marginBottom: 24,
  },
  button: {
    backgroundColor: '#2d7a4f', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 17, fontWeight: '600'},
});
