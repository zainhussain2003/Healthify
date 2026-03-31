import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {parseRecipe} from '../api/recipes';
import {colors} from '../theme';
import ScreenHeader from '../components/ScreenHeader';

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
      Alert.alert('Error', err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to parse recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Paste Your Recipe</Text>
        <Text style={styles.hint}>
          Include ingredient amounts and instructions. Headers like "Ingredients:" and "Instructions:" help accuracy.
        </Text>

        <TextInput
          style={styles.titleInput}
          placeholder="Recipe title (optional)"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.textArea}
          placeholder="Paste your full recipe here..."
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={12}
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleParse} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryButtonText}>Parse Recipe →</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.white},
  scroll: {flex: 1},
  container: {padding: 24, paddingBottom: 48},
  heading: {fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8},
  hint: {fontSize: 13, color: colors.textMuted, marginBottom: 24, lineHeight: 20},
  titleInput: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    padding: 13, fontSize: 16, marginBottom: 12,
    color: colors.text, backgroundColor: colors.offWhite,
  },
  textArea: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    padding: 13, fontSize: 15, minHeight: 220, marginBottom: 24,
    color: colors.text, backgroundColor: colors.offWhite,
  },
  primaryButton: {
    backgroundColor: colors.green, borderRadius: 12,
    padding: 16, alignItems: 'center',
  },
  primaryButtonText: {color: '#fff', fontSize: 17, fontWeight: '700'},
});
