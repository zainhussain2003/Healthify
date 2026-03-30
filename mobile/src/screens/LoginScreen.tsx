import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {login} from '../api/auth';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await login(email, password);
      await AsyncStorage.setItem('jwt_token', response.token);
      navigation.replace('Home');
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Login failed. Check your credentials.';
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthify</Text>
      <Text style={styles.subtitle}>Healthier recipes, same great taste</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff'},
  title: {fontSize: 36, fontWeight: 'bold', color: '#2d7a4f', textAlign: 'center', marginBottom: 8},
  subtitle: {fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 40},
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14,
    marginBottom: 14, fontSize: 16,
  },
  button: {
    backgroundColor: '#2d7a4f', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  link: {color: '#2d7a4f', textAlign: 'center', marginTop: 20, fontSize: 14},
});
