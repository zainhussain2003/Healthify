import client from './client';
import { AuthResponse } from '../types';

export const register = (email: string, password: string): Promise<AuthResponse> =>
  client.post<AuthResponse>('/auth/register', { email, password }).then(r => r.data);

export const login = (email: string, password: string): Promise<AuthResponse> =>
  client.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data);
