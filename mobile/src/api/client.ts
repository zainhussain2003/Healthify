import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8080/api/v1'; // 10.0.2.2 = localhost from Android emulator

const client = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 15000,
});

client.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
