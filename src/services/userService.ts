import api from './api';
import { User } from '@/types';

export const userService = {
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },
};
