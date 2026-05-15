import api from './api';
import { Chat } from '@/types';

interface ChatsResponse {
  chats: Chat[];
}

interface ChatResponse {
  chat: Chat;
}

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const response = await api.get<ChatsResponse>('/chats');
    return response.data.chats;
  },

  async createPrivateChat(userId: string): Promise<Chat> {
    const response = await api.post<ChatResponse>('/chats', { userId });
    return response.data.chat;
  },

  async createGroupChat(groupName: string, members: string[], groupIcon?: string): Promise<Chat> {
    const response = await api.post<ChatResponse>('/chats/group', { groupName, members, groupIcon });
    return response.data.chat;
  },

  async addGroupMember(chatId: string, userId: string): Promise<Chat> {
    const response = await api.put<ChatResponse>('/chats/group/add', { chatId, userId });
    return response.data.chat;
  },

  async removeGroupMember(chatId: string, userId: string): Promise<Chat> {
    const response = await api.put<ChatResponse>('/chats/group/remove', { chatId, userId });
    return response.data.chat;
  },
};
