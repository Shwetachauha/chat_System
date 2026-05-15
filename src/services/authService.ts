import api from './api';
import { LoginCredentials, RegisterCredentials, User } from '@/types';

interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { name, email, password } = credentials;
    const response = await api.post<AuthResponse>('/auth/signup', { name, email, password });
    return response.data;
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>('/auth/refresh-token');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ user: User }>('/users/profile');
    return response.data.user;
  },
};
