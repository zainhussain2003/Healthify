import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {colors} from '../theme';
import HealthifyLogo from '../components/HealthifyLogo';
import HealthifyWordmark from '../components/HealthifyWordmark';

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
      <View style={styles.logoSection}>
        <HealthifyLogo size={110} />
        <View style={styles.wordmarkWrap}>
          <HealthifyWordmark size="large" />
        </View>
        <Text style={styles.subtitle}>What would you like to do?</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('RecipeEntry')}>
          <Text style={styles.primaryButtonText}>Healthify a Recipe</Text>
          <Text style={styles.primaryButtonSub}>Paste or type any recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SavedRecipes')}>
          <Text style={styles.secondaryButtonText}>My Saved Recipes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutWrap}>
        <Text style={styles.logout}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 44,
  },
  wordmarkWrap: {
    marginTop: 12,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttons: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: colors.green,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  primaryButtonSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 4,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutWrap: {
    marginTop: 36,
    alignItems: 'center',
  },
  logout: {
    color: colors.textLight,
    fontSize: 14,
  },
});
