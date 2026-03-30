import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({navigation}: Props) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthify</Text>
      <Text style={styles.subtitle}>What would you like to do?</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('RecipeEntry')}>
        <Text style={styles.buttonText}>Healthify a Recipe</Text>
        <Text style={styles.buttonSubtext}>Paste or type any recipe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('SavedRecipes')}>
        <Text style={styles.secondaryText}>My Saved Recipes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8faf9'},
  title: {fontSize: 36, fontWeight: 'bold', color: '#2d7a4f', textAlign: 'center', marginBottom: 8},
  subtitle: {fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 48},
  primaryButton: {
    backgroundColor: '#2d7a4f', borderRadius: 14, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '700'},
  buttonSubtext: {color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4},
  secondaryButton: {
    borderWidth: 2, borderColor: '#2d7a4f', borderRadius: 14, padding: 18,
    alignItems: 'center', marginBottom: 40,
  },
  secondaryText: {color: '#2d7a4f', fontSize: 16, fontWeight: '600'},
  logout: {color: '#999', textAlign: 'center', fontSize: 14},
});
