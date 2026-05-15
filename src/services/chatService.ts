import api from './api';
import { Chat } from '@/types';

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const response = await api.get<Chat[]>('/chats');
    return response.data;
  },

  async getChatById(chatId: string): Promise<Chat> {
    const response = await api.get<Chat>(`/chats/${chatId}`);
    return response.data;
  },

  async createPrivateChat(userId: string): Promise<Chat> {
    const response = await api.post<Chat>('/chats/private', { userId });
    return response.data;
  },

  async createGroupChat(name: string, participantIds: string[]): Promise<Chat> {
    const response = await api.post<Chat>('/chats/group', { name, participantIds });
    return response.data;
  },

  async addGroupMember(chatId: string, userId: string): Promise<Chat> {
    const response = await api.post<Chat>(`/chats/${chatId}/members`, { userId });
    return response.data;
  },

  async removeGroupMember(chatId: string, userId: string): Promise<Chat> {
    const response = await api.delete<Chat>(`/chats/${chatId}/members/${userId}`);
    return response.data;
  },
};
