import api from './api';
import { User } from '@/types';

interface UsersResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

export const userService = {
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<UsersResponse>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data.users;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<UserResponse>('/users/profile');
    return response.data.user;
  },

  async updateProfile(data: { name?: string; avatar?: string }): Promise<User> {
    const response = await api.put<UserResponse>('/users/profile', data);
    return response.data.user;
  },
};
